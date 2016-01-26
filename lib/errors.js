/*
 * Copyright 2016 Resin.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var chalk = require('chalk');
var options = require('./options');

exports.handle = function(error) {
  if (!error) {
    return;
  }

  console.error('Usage: etcher <image>');
  console.error('Example: etcher path/to/image.img\n');
  console.error(chalk.red('ERROR: ' + error.message));

  if (process.env.DEBUG) {
    console.error(chalk.red(error.stack));
  }

  options.print('*', function(error) {
    if (error) {
      throw error;
    }

    console.error('\nIf you need help, don\'t hesitate in contacting us at:\n');
    console.error('  GitHub: https://github.com/resin-io/etcher-cli/issues/new');
    console.error('  Gitter: https://gitter.im/resin-io/chat');
    process.exit(1);
  });
};
