var spawn = require('child_process').spawn;
var path = require('path');
var os = require('os')

var _ = require('underscore');


function parseKey(data, searched) { // 
	//console.dir(data.split('\r\n'));
	var items = data.split('\r\n');
	//console.log(data);
	if (data.search(new RegExp(searched, 'gmi')) !== -1) {
		for (var i = 0; i < items.length; ++i) {
			var keys = items[i].split('    ');
			if (keys.length === 4) {
				if (keys[1] === searched) {
					return {
						name: keys[1],
						type: keys[2],
						value: keys[3]
					};
				}
			}
		}
	}
	return null;
}

function searchPaths(firstPath, searched, callBack, ignoreList) {
	// recursively search.
	var activeChild = 0;
	var closedChild = 0;
	var dataFounded = [];
	var errorFounded = [];
	if (os.platform() !== 'win32') {
		throw new Error('OS Platform : ' + os.platform() + ' doesn\'t support ! --> only windows platform');
	}
	if (ignoreList) { // prepare ignorelist.
		if (!(ignoreList instanceof Array)) {
			ignoreList = [ignoreList];
		}
		ignoreList = _.map(ignoreList, function(item) {
			return '\\' + item;
		});
	}

	function searchPath(firstPath, searched) { // searpath recursively.

		if (firstPath && firstPath.split('    ').length === 1 && firstPath !== '') {
			var child = spawn('reg', ['QUERY', firstPath.replace(/\//gm, path.sep)]); // run reg command.
			++activeChild; // running child.
			var bufferStdOut = new Buffer('');
			var bufferStdErr = new Buffer('');
			child.stdout.on('data', function(data) {
				bufferStdOut += data;
			});
			child.on('close', function(code) {

				if (code === 0) {
					var dataStr = bufferStdOut.toString('utf8');
					var splitData = dataStr.split('\r\n');
					var res = parseKey(dataStr, searched);
					if (res === null) {
						_.each(splitData, function(item) {
							if (item !== firstPath) {
								// console.log(item); //debug
								if (ignoreList) {
									var ignored = false;
									_.each(ignoreList, function(ignore) { // search ignorelist.
										if (!ignored) {
											if (item.search(new RegExp(ignore, 'gmi')) !== -1) {
												ignored = true;
											}
										}
									});
									if (!ignored) {
										searchPath(item, searched);
									}
								} else {
									searchPath(item, searched);
								}
							}
						});

					} else {
						dataFounded.push(res);
					}
				} else {
					errorFounded.push({
						err: 'REG Error !',
						msg: bufferStdErr.toString('utf8')
					});
				}
				++closedChild; // closed child.
				if (activeChild === closedChild) {
					if (errorFounded.length === 0 || dataFounded.length !== 0) {
						callBack(null, dataFounded);
					} else {
						callBack(errorFounded);
					}
				}
			});

			child.stderr.on('data', function(data) {
				bufferStdErr += data
			});
		}
	}

	searchPath(firstPath, searched);
}

// control version from the  output string.
function controlVersion(output, version) { // control java version.
	version = String(version);
	var items = version.split('.');
	var searched = version;
	if (items.length === 2) {
		searched += '.\\d';
	}
	var reg = new RegExp(searched, 'gm');
	var res = false;
	if (output.search(reg) !== -1) {
		res = true;
	}
	return res;
}

function controlJavaVersion(inputObj, version, callBack) {
	var javaPath = inputObj.value;
	var child = spawn(javaPath, ['-version']);
	var bufferStdOut = new Buffer('');
	var bufferStdErr = new Buffer('');
	child.stdout.on('data', function(data) {
		bufferStdOut += data;
	});

	child.on('close', function(code) {
		if (controlVersion((bufferStdOut + bufferStdErr).toString('utf8'), version)) {
			callBack(inputObj);
		} else {
			callBack(null);
		}
	});

	child.stderr.on('data', function(data) {
		bufferStdErr += data
	});
}


// search regs with  ticketName  if ignoreList defined, we can be ignored theirs.
function searchTicketByTheVersion(root, ticketName, version, callBack, ignoreList) {
	var platform = os.platform(); // get platform.
	if (platform === 'win32') { // check windows platform
		searchPaths(root, ticketName, function(err, data) { // x64
			if (err) {
				callBack(err);
			} else if (data) {
				var founded = false;
				var countSearch = 0;
				var errorMessage = 'Not found ' + ticketName + ' by the version ' + version;
				for (var i = 0; i < data.length; i++) { // control version in results.
					var javaHomeValue = data[i].value;
					if (javaHomeValue.search(new RegExp(version, 'gmi')) !== -1) {
						//console.log(javaHomeValue); // debug
						controlJavaVersion({
							value: data[i].value + '/bin/java'
						}, version, function(resObj) { // control version item.
							++countSearch;
							if (!founded) { // if founded not to do.
								if (resObj) { //if found path call callBack.
									founded = true;
									callBack(null, resObj);
									return;
								}
								if (countSearch === data.length) {
									callBack({
										err: 'Found Error',
										msg: errorMessage
									});
								}
							}
						});
					} else {
						++countSearch;
					}

				}
				// if all or  some miss call controlJavaVersion, we can handle to call callBack.
				if (countSearch === data.length) {
					callBack({
						err: 'Found Error',
						msg: errorMessage + ' 2'
					});
				}

			}

		}, ignoreList);
	} else { // not supported platform.
		throw new Error('OS Platform : ' + os.platform() + ' doesn\'t support ! --> only windows platform');
	}
}

//search roots that we can find javaHome with version
//throws syntax error if callBack is not a function. 
function getJavaHome(version, callBack, option) {
	controlJavaVersion({ // if java defined.
		value: 'java'
	}, version, function(resObj) {
		if (resObj) { //if found path call callBack.
			callBack(null, resObj.value);
			return;
		}
		var roots = [];
		if (option && option.root) {
			if (option.root instanceof Array) {
				_.each(option.root, function(item) {
					roots.push(item);
				});
			} else {
				roots.push(option.root);
			}

		} else {
			roots.push('HKLM/SOFTWARE/JavaSoft');
			roots.push('HKLM/SOFTWARE/Wow6432Node/JavaSoft');
			roots.push('HKCU/SOFTWARE/JavaSoft');
			roots.push('HKCU/SOFTWARE/Wow6432Node/JavaSoft');
		}
		if (typeof callBack !== 'function') {
			var err = {
				err: 'Syntax Error',
				msg: 'check usage --> (version, callBack [ , option ] ) '

			};
			throw err;
		}

		var founded = false;
		var countSearch = 0;
		for (var i = 0; i < roots.length; i++) {
			searchTicketByTheVersion(roots[i], 'JavaHome', version, function(err, data) {
				++countSearch;
				if (!founded) {
					if (data && data.value) {
						founded = true; // found correct path.
						callBack(null, data.value);
					}
				}
				if (countSearch === roots.length) {

					if (!founded) {
						callBack({
							err: 'Found Error',
							msg: 'Not found JavaHome by the version ' + version
						});
					}
				}
			}, ['microsoft', 'Classes']);
			if (founded) {
				break;
			}
		}
	});

}





// javHome by the version. 
exports.getJavaHome = getJavaHome;
exports.controlJavaVersion = controlJavaVersion;
exports.search = searchPaths;