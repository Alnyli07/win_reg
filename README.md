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

# output: test/test.js
``
C:\Program Files (x86)\Java\jdk1.7.0_75/bin/java
``

``
[ { name: 'JavaHome',
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
    value: 'C:\\Program Files (x86)\\Java\\jre7' } ]
``

will continue to be implemented other functions.
Such as:
``
	versionController // you can be controlled version of specific software. 
``

