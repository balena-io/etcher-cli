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

'use strict';

var visuals = require('resin-cli-visuals');
var form = require('resin-cli-form');
var writer = require('./writer');
var utils = require('./utils');
var options = require('./cli');

form.run([
  {
    message: 'Select drive',
    type: 'drive',
    name: 'drive'
  },
  {
    message: 'This will erase the selected drive. Are you sure?',
    type: 'confirm',
    name: 'yes',
    default: false
  }
], {
  override: {
    drive: options.drive,

    // If `options.yes` is `false`, pass `undefined`,
    // otherwise the question will not be asked because
    // `false` is a defined value.
    yes: options.yes || undefined

  }
}).then(function(answers) {
  if (!answers.yes) {
    throw new Error('Aborted');
  }

  var progressBar = new visuals.Progress('Burning');
  return writer.safelyWrite(answers.drive, options._[0], function(state) {
    return progressBar.update(state);
  });
}).then(function() {
  console.log('Your flash is complete!');
}).catch(function(error) {
  utils.printError(error);
  process.exit(1);
});
