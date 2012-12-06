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
 */

// Set the paths needed for our tests
APP_CONFIG.paths.test = '/src/test/javascript/test/';
APP_CONFIG.baseUrl = '/src/main/webapp/app/js/';

// APP_CONFIG is the same object used by the official application "start.js" file
require.config(APP_CONFIG);

// Wrapping it because we don't the "tests" variable available outside this file.
(function () {

    // Don't forget to put a new entry here whenever you add a new test file.
    var tests = [
        'test/I18N',
        'test/DelayedTask',
        'test/Obj',
        'test/Sequence',
        'test/ApplicationChannel',
        'test/ApplicationController',
        'test/ApplicationModel'
    ];

    // Load all the test modules before starting.
    require(tests, function () {
        $(document).ready(function () {
            jasmine.getEnv().addReporter(
                new jasmine.HtmlReporter()
            );
            // Run tests!
            jasmine.getEnv().execute();
        });
    });
})();
