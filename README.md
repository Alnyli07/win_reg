# reg_java

Windows regedit  search operations.

# npm test case
``
npm test
``

# node test case
``
node test/test.js
``
# Example Code for using
```js

var reg = require('reg_java');


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

```

# output: test/test.js
``
C:\Program Files (x86)\Java\jdk1.7.0_75/bin/java
``

``
[
 { name: 'JavaHome',
    type: 'REG_SZ',
    value: 'C:\\Program Files (x86)\\Java\\jdk1.7.0_75' },

  { name: 'JavaHome',
    type: 'REG_SZ',
    value: 'C:\\Program Files (x86)\\Java\\jre7' },

  { name: 'JavaHome',
    type: 'REG_SZ',
    value: 'C:\\Program Files (x86)\\Java\\jre1.8.0_45' },

  { name: 'JavaHome',
    type: 'REG_SZ',
    value: 'C:\\Program Files (x86)\\Java\\jdk1.7.0_75' },

  { name: 'JavaHome',
    type: 'REG_SZ',
    value: 'C:\\Program Files (x86)\\Java\\jre1.8.0_45' },

  { name: 'JavaHome',
    type: 'REG_SZ',
    value: 'C:\\Program Files (x86)\\Java\\jre7' },

  { name: 'JavaHome',
    type: 'REG_SZ',
    value: 'C:\\Program Files (x86)\\Java\\jre1.8.0_45' },

  { name: 'JavaHome',
    type: 'REG_SZ',
    value: 'C:\\Program Files (x86)\\Java\\jre7' } 
 ]
``

will continue to be implemented other functions.
Such as:
``
	versionController // you can be controlled version of specific software. 
``

