var spawn = require('child_process').spawn;
var path = require('path');

var _ = require('underscore');


var child = spawn('reg', ['QUERY', 'HKLM']);


var child = spawn('REG', ['QUERY', path.normalize('HKLM/SOFTWARE/')]);

child.on('close', function(err) {
	if (err) {
		console.log('Error comand !' + err);

	} else {}
});


function parseKey(data, searched) {
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

function searchPaths(firstPath, searched, callBack) {
	// recursively search.
	var activeChild = 0;
	var closedChild = 0;
	var dataFounded = [];
	var errorFounded = [];

	function searchPath(firstPath, searched) {

		if (firstPath && firstPath.split('    ').length === 1 && firstPath !== '') {
			var child = spawn('reg', ['QUERY', firstPath.replace(/\//gm, path.sep)]);
			++activeChild;
			var bufferStdOut = new Buffer('');
			var bufferStdErr = new Buffer('');
			child.stdout.on('data', function(data) {
				bufferStdOut += data;
			});
			child.on('close', function(code) {
				++closedChild;
				if (code === 0) {
					var dataStr = bufferStdOut.toString('utf8');
					var splitData = dataStr.split('\r\n');
					var res = parseKey(dataStr, searched);
					if (res === null) {
						_.each(splitData, function(item) {
							if (item !== firstPath) {
								searchPath(item, searched);
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
				if (activeChild === closedChild) {
					if (errorFounded.length === 0) {
						callBack(null, dataFounded);
					} else {

						callBack(errorFounded, dataFounded);
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

searchPaths('HKLM/SOFTWARE/JavaSoft', 'JavaHome', function(err, data) {
	if (err) {

	} else {
		if (data) {
			console.dir(data);
		}
	}
});

function controlVersion(outputJava, javaVersion) { // control java version.
	var items = javaVersion.split('.');
	var searched = javaVersion;
	if (items.length === 2) {
		searched += '.\\d';
	}
	var reg = new RegExp(searched, 'gm');
	var res = false;
	if (outputJava.search(reg) !== -1) {
		res = true;
	}
	return res;
}

function controlJavaVersion(version, callBack) {
	var child = spawn('java', ['-version']);

	var bufferStdOut = new Buffer('');
	var bufferStdErr = new Buffer('');
	child.stdout.on('data', function(data) {
		bufferStdOut += data;
	});

	child.on('close', function(code) {
		if (controlVersion((bufferStdOut + bufferStdErr).toString('utf8'), version)) {
			callBack(true);
		} else {
			callBack(false);
		}
	});

	child.stderr.on('data', function(data) {
		bufferStdErr += data
	});
}

controlJavaVersion('1.8', function(found) {
	if (found) {
		console.log('Java ' + 1.8 + ' bulundu.');
	} else {
		console.log('Java ' + 1.8 + ' bulunamadi.');
	}
})

exports.controlJavaVersion = controlJavaVersion;
exports.search = searchPaths;