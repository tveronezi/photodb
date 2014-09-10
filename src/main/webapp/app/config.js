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
        'text': 'webjars/requirejs-text/2.0.10/text',

        // http://lesscss.org/
        'lib/less': 'webjars/less/1.7.5/less.min',

        // http://jquery.com/
        'lib/jquery': 'webjars/jquery/2.1.1/jquery.min',

        // http://twitter.github.com/bootstrap/
        'lib/bootstrap': 'webjars/bootstrap/3.2.0/js/bootstrap.min',

        // http://handlebarsjs.com/
        'lib/handlebars': 'webjars/handlebars/2.0.0-alpha.2/handlebars.min',

        'lib/underscore': 'webjars/underscorejs/1.6.0/underscore-min',

        'lib/json2': 'webjars/json2/20110223/json2.min',

        'lib/backbone': 'webjars/backbonejs/1.1.2/backbone-min'
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