var reg = require('../lib/regedit');


// get javaHome with version 1.7
reg.getJavaHome(1.7, function(err, data) {
	if (err) {
		console.log(err.msg);
	}
	if (data) {
		console.log(data);
	}
});

//get JavaHome from HKLM/SOFTWARE and ignore directories 
// [ microsoft', 'Classes', 'Wow6432Node/Classes', 'Wow6432Node/Microsoft'] while searching. 
/** if not use ignoreList operation of search will be very slow.

in the example: 
	ignored: HKLM/SOFTWARE/microsoft
	ignored: HKLM/SOFTWARE/Classes
	ignored: HKLM/SOFTWARE/Wow6432Node/Classes
	ignored: HKLM/SOFTWARE/Wow6432Node/Microsoft
*/
reg.search('HKLM/SOFTWARE/', 'JavaHome', function(err, data) {
	if (err) {
		console.dir(err);
	}
	if (data) {
		console.dir(data);
	}
}, ['microsoft', 'Classes', 'Wow6432Node/Classes', 'Wow6432Node/Microsoft']);