const moduleAlias = require('module-alias');

const destPath = process.argv[1].split(/index\...$/)[0];

console.log('>>>>>>>' + destPath);
moduleAlias.addAliases({
  '@src': `${destPath}`,
  '@api': `${destPath}/api`,
  '@cli': `${destPath}/cli`,
  '@database': `${destPath}/database`,
  '@classes': `${destPath}/classes`,
  '@common': `${destPath}/common`,
  '@events': `${destPath}/events`
});

import { CLI } from './cli/cli';
import Socket from './socket';

Socket.create();
// new CLI();
