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

        var Menu = Backbone.View.extend({
            tagName: 'ul',
            className: 'nav',

            events: {
                'click a': function (evt) {
                    // TRICK: to avoid full page reload.
                    evt.preventDefault();
                    var href = $(evt.currentTarget).attr('href');
                    this.trigger('navigate', {
                        href: href
                    });
                }
            },

            render: function () {
                this.$el.empty();
                var html = templates.getValue('menu', {
                    'files-cls': this.model.get('files'),
                    'about-cls': this.model.get('about')
                });
                this.$el.html(html);
                return this;
            },

            initialize: function () {
                this.listenTo(this.model, 'change', this.render);
            }
        });

        return Backbone.View.extend({
            el: 'body',
            showView: function (view) {
                var contentarea = this.$('.ux-contentarea');
                contentarea.empty();
                contentarea.append(view.el);
            },
            render: function () {
                if (this.options.isRendered) {
                    return this;
                }

                var html = templates.getValue('container');
                this.$el.html(html);

                var menuContainer = this.$('.ux-menu');
                menuContainer.append(this.options.menu.render().$el);

                // TRICK: render this view only once.
                this.options.isRendered = true;
                return this;
            },
            initialize: function () {
                var menu = new Menu({
                    model: this.options.menuModel
                });
                var self = this;
                self.options.menu = menu;
                self.listenTo(menu, 'navigate', function (data) {
                    self.trigger('navigate', data);
                });
            }
        });

    });
}());


