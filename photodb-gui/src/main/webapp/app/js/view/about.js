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

(function () {
    'use strict';

    var deps = ['app/js/templates', 'app/js/i18n', 'lib/backbone'];
    define(deps, function (templates) {

        return Backbone.View.extend({
            events: {
                'click a': function (evt) {
                    // TRICK: to avoid full page reload.
                    evt.preventDefault();
                    var href = $(evt.currentTarget).attr('href');
                    window.open(href);
                }
            },
            render: function () {
                var self = this;
                self.$el.empty();

                var html = templates.getValue('about');
                self.$el.html(html);

                return this;
            }
        });

    });
}());


