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

var APP_CONFIG = {
    baseUrl: window.ux.ROOT_URL,
    paths: {
        // https://github.com/requirejs/text
        'text': 'app/lib/require/text',

        // http://lesscss.org/
        'lib/less': 'app/lib/less/less-1.3.0.min',

        // http://jquery.com/
        'lib/jquery': 'app/lib/jquery/jquery-1.7.2.min',

        // http://twitter.github.com/bootstrap/
        'lib/bootstrap': 'app/lib/bootstrap/2.1.1/js/bootstrap.min',

        // http://handlebarsjs.com/
        'lib/handlebars': 'app/lib/handlebars/handlebars-1.0.rc.1',

        'lib/underscore': 'app/lib/underscore/underscore-1-4-3',

        'lib/json2': 'app/lib/json2/json2-2012-10-08',

        'lib/backbone': 'app/lib/backbone/backbone_1-0-0-min'
    },
    shim: {
        // bootstrap depends on jquery, therefore we need to load jquery first
        // http://requirejs.org/docs/api.html#config-shim
        'lib/bootstrap': {
            deps: ['lib/jquery']
        },

        'lib/underscore': {
            exports: '_'
        },

        'lib/backbone': {
            deps: ['lib/jquery', 'lib/json2', 'lib/underscore']
        },

        'app/js/templates': {
            deps: ['lib/underscore', 'app/js/i18n']
        },

        'app/js/models': {
            deps: ['lib/underscore']
        }
    }
};