var reg = require('../lib/regedit');


reg.getJavaHome(1.7, function(err, data) {
	if (err) {
		console.log(err.msg);
	}
	if (data) {
		console.log(data);
	}
});




reg.search('HKLM/SOFTWARE', 'JavaHome', function(err, data) {
	if (err) {
		console.dir(err.msg);
	}
	if (data) {
		console.dir(data);
	}
}, ['microsoft', 'Classes', 'Wow6432Node']);