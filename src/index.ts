const moduleAlias = require('module-alias');
const destPath = process.argv[1].split(/index\...$/)[0];

moduleAlias.addAliases({
  '@src': `${destPath}`
});

import Bootstrap from './Bootstrap';
Bootstrap.init();
