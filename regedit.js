var spawn = require('child_process').spawn;
var path = require('path');

var _ = require('underscore');




var child = spawn('REG', ['QUERY', path.normalize('HKLM/SOFTWARE/JavaSoft')]);

child.on('close', function(err) {
	if (err) {
		console.log('Error comand !' + err);
		console.log(child.output);
	} else {}
});

child.stdout.on('data', function(data) {
	//console.log('STDOUT:' + data);
	parseKey(data.toString('utf8'), 'JavaHome');
});
child.stderr.on('data', function(data) {
	console.log('STDERR:' + data);
});

function parseKey(data, searched, callBack) {
	//console.dir(data.split('\r\n'));
	var items = data.split('\r\n');
	for (var i = 0; i < items.length; ++i) {
		var keys = items[i].split('    ');
		if (keys.length === 4) {
			if (keys[1] === searched) {
				console.log(keys[1]);
				return keys;
			}
		}
	}


}