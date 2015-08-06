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

searchPaths('HKLM/SOFTWARE/Wow6432Node/JavaSoft', 'JavaHome', function(err, data) {
	if (err) {
		console.dir(err.msg);
	} else {
		if (data) {
			console.dir(data);
			process.exit();
		}
	}
});