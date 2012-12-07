/**
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 "use strict";
 */

"use strict";
define([],
    function () {
        // http://www.quirksmode.org/js/keys.html
        function keyCodeToString(keyCode) {
            if (keyCode === 16) {
                return 'shift';
            }

            if (keyCode === 17) {
                return 'control';
            }

            if (keyCode === 18) {
                return 'alt';
            }

            if (keyCode === 27) {
                return 'esc';
            }

            if (keyCode === 46) {
                return 'delete';
            }

            // Numbers or Letters
            if (keyCode >= 48 && keyCode <= 57 || //Numbers
                keyCode >= 65 && keyCode <= 90) { //Letters
                return String.fromCharCode(keyCode);
            }

            if (keyCode >= 112 && keyCode <= 123) { //F1 -> F12
                return 'F' + (keyCode - 111);
            }

            return null;
        }

        function getArray(obj) {
            if (!obj) {
                return [];
            }

            // IE9 does not have FileList
            if (window.FileList && obj instanceof window.FileList) {
                return obj;
            }

            if (obj instanceof Array) {
                return obj;
            }

            return [obj];
        }

        function forEach(value, callback) {
            var arr = getArray(value);
            for (var i = 0; i < arr.length; i++) {
                callback(arr[i], i);
            }
        }

        function forEachKey(obj, callback) {
            if (!obj) {
                return;
            }
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (callback(key, obj[key]) === false) {
                        // return false if you want to break the loop
                        break;
                    }
                }
            }
        }

        // http://stackoverflow.com/a/193853 -> Really nice trick to get rid of the javascript 'this' nightmare!
        function bindScope(scope, fn) {
            return function () {
                fn.apply(scope, arguments);
            };
        }

        return {
            keyCodeToString:keyCodeToString,
            getArray:getArray,
            forEach:forEach,
            forEachKey:forEachKey,
            bindScope:bindScope
        }
    }
);
