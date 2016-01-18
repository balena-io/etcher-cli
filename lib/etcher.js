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

var _ = require('lodash');
var fs = require('fs');
var capitano = require('capitano');
var Promise = require('bluebird');
var form = require('resin-cli-form');
var visuals = require('resin-cli-visuals');
var asciimo = require('asciimo').Figlet;
var chalk = require('chalk');
var isElevated = require('is-elevated');

var options = require('./options');
var errors = require('./errors');
var writer = require('./writer');

capitano.command({
  signature: '[image]',
  description: 'burn an image',
  options: [
    {
      signature: 'drive',
      description: 'drive',
      parameter: 'drive',
      alias: 'd'
    },
    {
      signature: 'yes',
      description: 'confirm non-interactively',
      boolean: true,
      alias: 'y'
    }
  ],
  action: function(params, options, done) {

    if (!params.image) {
      throw new Error([
        'You\'re missing the path to the image.',
        'Try running: etcher path/to/image.img'
      ].join('\n'));
    }

    // Assert that image exists
    fs.accessSync(params.image);

    var burn = function(options) {
      console.log(chalk.red('Image: ') + params.image + '\n');

      return Promise.try(function() {
        return options.drive || form.ask({
          message: 'Select drive',
          type: 'drive'
        });
      })
      .tap(function(drive) {
        return options.yes || form.ask({
          message: 'This will erase ' + drive + '. Are you sure?',
          type: 'confirm',
          default: false
        }).tap(function(confirmed) {
          if (!confirmed) {
            throw new Error('Aborted');
          }
        });
      })
      .tap(function(drive) {

        // Put a blank line to add some spacing
        console.log('');

        var progressBar = new visuals.Progress('Burning');
        return writer.safelyWrite(drive, params.image, function(state) {
          return progressBar.update(state);
        });
      })
      .then(function(drive) {
        console.log('Burn complete!\n');

        return form.ask({
          message: 'Would you like to burn this image again to another drive?',
          type: 'confirm',
          default: false
        })
        .then(function(repeat) {
          if (repeat) {
            console.log('');
            return burn({ yes: options.yes });
          }

          console.log('Thanks for using Resin Etcher!');
        });
      });
    };

    isElevated(function(error, elevated) {
      if (error) {
        return done(error);
      }

      if (!elevated) {
        return done(new Error([
          'You don\'t have enough privileges to run this operation.\n',
          'Try prepending this command with sudo or running in an Administrator command prompt'
        ].join('\n')));
      }

      asciimo.write('Etcher', 'doom', function(text) {
        process.stdout.write(text);
        return burn(options).nodeify(done);
      });
    });
  }
});

capitano.run(process.argv, errors.handle);
