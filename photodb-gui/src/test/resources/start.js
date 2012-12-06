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

require.config({
    baseUrl: '/src/main/webapp/app/js/',
    paths: {
        'test': '/src/test/javascript/test/',
        'text': '../lib/require/text',
        'lib/d3': '../lib/d3/d3.v2.min',
        'lib/less': '../lib/less/less-1.3.0.min',
        'lib/jquery': '../lib/jquery/jquery-1.7.2.min',
        'lib/bootstrap': '../lib/bootstrap/2.1.1/js/bootstrap.min',
        'lib/handlebars': '../lib/handlebars/handlebars-1.0.rc.1'
    },
    shim: {
        'lib/bootstrap': {
            deps: ['lib/jquery']
        }
    }
});

(function () {
    var tests = [
        'test/I18N',
        'test/DelayedTask',
        'test/Obj',
        'test/Sequence',
        'test/ApplicationChannel',
        'test/ApplicationController',
        'test/ApplicationModel'
    ];

    /**
     * Load all the test modules before starting.
     */
    require(tests, function () {
        $(document).ready(function () {
            jasmine.getEnv().addReporter(
                new jasmine.HtmlReporter()
            );
            jasmine.getEnv().execute();
        });
    });
})();
