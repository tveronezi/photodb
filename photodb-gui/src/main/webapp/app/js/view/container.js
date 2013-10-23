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
    define(deps, function (templates, i18n) {

        var View = Backbone.View.extend({
            el: 'body',

            showView: function (view) {
                var contentarea = this.$('.ux-contentarea');
                contentarea.empty();
                view.render();
                contentarea.append(view.el);

                this.$('.ux-app-menu-item').removeClass('active');
                var myMenuItem = this.$('li.ux-app-menu-item.ux-' + view.className);
                myMenuItem.addClass('active');
            },

            events: {
                'click .ux-app-menu-item a': function (evt) {
                    evt.preventDefault();

                    var myLink = $(evt.target);
                    this.$('.ux-app-menu-item').removeClass('active');
                    var myMenu = myLink.parent();
                    myMenu.addClass('active');

                    var href = myLink.attr('href');
                    this.trigger('navigate', {
                        href: href
                    });
                }
            },

            render: function () {
                var me = this;
                if (me.options.isRendered) {
                    return;
                }
                me.$el.html(templates.getValue('container', {}));
                me.options.signin = $(templates.getValue('signin', {}));
                me.options.signin.on('click', function(evt) {
                    evt.preventDefault();
                    me.trigger('signin');
                });

                me.options.signout = $(templates.getValue('signout', {}));
                me.options.signout.on('click', function(evt) {
                    evt.preventDefault();
                    me.trigger('signout');
                });

                me.setSignMode('signin');

                // render it only once
                me.options.isRendered = true;
                return me;
            },

            setSignMode: function (mode) {
                var me = this;
                me.options.signin.detach();
                me.options.signout.detach();

                // mode is 'signin' or 'signout'
                me.$('ul.ux-login-menu').append(this.options[mode]);
            }
        });

        return new View({});
    });
}());


