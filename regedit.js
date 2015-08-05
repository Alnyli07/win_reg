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
	parseKey(data.toString('utf8'));
});
child.stderr.on('data', function(data) {
	console.log('STDERR:' + data);
});

function parseKey(data, callBack) {
	//console.dir(data.split('\r\n'));
	_.each(data.split('\r\n'), function(item) {
		if (item.search(/    /gm) !== -1) {
			console.log(item);
		}
	});
}