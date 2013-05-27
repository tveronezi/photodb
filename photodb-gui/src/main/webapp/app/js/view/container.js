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

    var deps = ['app/js/templates', 'app/js/view/login', 'app/js/i18n', 'lib/backbone'];
    define(deps, function (templates, loginView, i18n) {

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
                    // TRICK to avoid full page reload.
                    evt.preventDefault();

                    var myLink = $(evt.target);
                    this.$('.ux-app-menu-item').removeClass('active');
                    var myMenu = myLink.parent();
                    myMenu.addClass('active');

                    var href = myLink.attr('href');
                    this.trigger('navigate', {
                        href: href
                    });
                },
                'click a.ux-signout': function (evt) {
                    // TRICK to avoid full page reload.
                    evt.preventDefault();
                    this.trigger('signout');
                }
            },

            render: function () {
                if (this.options.isRendered) {
                    return;
                }

                var html = templates.getValue('container', {
                    userName: ''
                });
                this.$el.html(html);

                loginView.render();
                this.options.signin = $(templates.getValue('signin', {}));
                this.options.signin.children('div.ux-sigin-form').append(loginView.el);

                this.options.signout = $(templates.getValue('signout', {}));

                this.setSignMode('signin');

                // render it only once
                this.options.isRendered = true;
                return this;
            },

            setSignMode: function (mode) {
                this.options.signin.detach();
                this.options.signout.detach();

                loginView.$('.ux-user-credentials').each(function (index, el) {
                    el.reset();
                });

                // mode is 'signin' or 'signout'
                this.$('ul.ux-login-menu').append(this.options[mode]);
            },

            setUserName: function (userName) {
                if (!userName || userName.trim() === '') {
                    this.$('span.user-name').html(i18n.get('visitor'));

                } else {
                    this.$('span.user-name').html(userName);
                }

            }
        });

        return new View({});
    });
}());


