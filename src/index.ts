const moduleAlias = require('module-alias');

const destPath = process.argv[1].split(/index\...$/)[0];

console.log('>>>>>>>' + destPath);
moduleAlias.addAliases({
  '@src': `${destPath}`
});

import Bootstrap from './Bootstrap';
Bootstrap.init();