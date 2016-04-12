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

var fs = require('fs');
var os = require('os');
var Promise = require('bluebird');
var umount = Promise.promisifyAll(require('umount'));
var imageWrite = require('resin-image-write');
var isWindows = os.platform() === 'win32';

if (isWindows) {
  var removedrive = Promise.promisifyAll(require('removedrive'));
}

exports.safelyWrite = function(drive, image, onProgress) {
  return umount.umountAsync(drive).then(function() {
    var stream = fs.createReadStream(image);
    stream.length = fs.statSync(image).size;

    return new Promise(function(resolve, reject) {
      var writer = imageWrite.write(drive, stream);
      writer.on('progress', onProgress);
      writer.on('error', reject);
      writer.on('done', resolve);
    }).then(function() {
      if (isWindows) {
        return removedrive.ejectAsync(drive);
      } else {
        return umount.umountAsync(drive);
      }
    });
  });
};
