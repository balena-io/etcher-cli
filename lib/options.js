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
var columnify = require('columnify');
var capitano = require('capitano');
var indentString = require('indent-string');

var parse = function(object) {
  return _.object(_.map(object, function(item) {
    return [
      item.toString(),
      item.description
    ];
  }));
};

exports.print = function(command, callback) {
  capitano.state.getMatchCommand(command, function(error, command) {
    if (error) {
      return callback(error);
    }

    if (!_.isEmpty(command.options)) {
      console.log('\nOptions:\n');

      console.log(indentString(columnify(parse(command.options), {
        showHeaders: false,
        minWidth: 25
      }), ' ', 2));
    }

    return callback();
  });
};
