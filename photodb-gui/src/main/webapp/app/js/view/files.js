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

    var deps = ['app/js/model/files', 'app/js/templates', 'lib/underscore', 'app/js/i18n', 'lib/backbone'];
    define(deps, function (filesList, templates) {

        var FileDetailsView = Backbone.View.extend({
            tag: 'div',
            className: 'panel panel-default ux-detail',

            events: {
                'click .ux-close-action': function () {
                    var me = this;
                    me.trigger('close-action', {
                        model: me.model
                    });
                },
                'click .ux-delete-action': function () {
                    var me = this;
                    me.trigger('delete-action', {
                        model: me.model
                    });
                }
            },

            render: function () {
                var me = this;
                me.$el.empty();
                me.$el.html(templates.getValue('file-details', {
                    content: window.ux.ROOT_URL + 'rest/photos/raw/' + me.model.get('id'),
                    name: me.model.get('name')
                }));
                return me;
            },

            initialize: function () {
                var me = this;
                me.listenTo(me.model, 'destroy', function () {
                    me.remove();
                });
                me.listenTo(me.model, 'change', function () {
                    me.render();
                });
            }
        });

        var FileView = Backbone.View.extend({
            tagName: 'div',
            className: 'photo',

            events: {
                'click': function () {
                    var me = this;
                    me.trigger('photo-clicked', {
                        model: me.model
                    });
                }
            },

            render: function () {
                var me = this;
                me.$el.html(templates.getValue('file', {
                    content: me.model.get('content'),
                    name: me.model.get('name')
                }));
                return me;
            },

            initialize: function () {
                var me = this;
                me.listenTo(me.model, 'destroy', function () {
                    me.remove();
                });
            }
        });

        var Container = Backbone.View.extend({
            tagName: 'div',
            className: 'photos',
            options: {isRendered: false},

            render: function () {
                var me = this;
                if (me.options.isRendered) {
                    return me;
                }
                me.$el.html(templates.getValue('files'));
                me.$('.ux-upload-file-input').each(function (index, input) {
                    $(input).on('change', function (ev) {
                        me.trigger('file-drop', ev.currentTarget);
                    });
                });
                me.options.isRendered = true;
                return me;
            },

            showDetails: function (data) {
                var me = this;
                me.options.photosArea = $(me.$('.photos-area')[0]);
                me.options.photosArea.detach();
                var detail = new FileDetailsView({
                    model: data.model
                }).render();
                me.$el.prepend(detail.el);

                var removeDetail = function () {
                    detail.remove();
                    me.$el.prepend(me.options.photosArea);
                    me.options.photosArea = null;
                };

                detail.on('destroy', function () {
                    removeDetail();
                });
                me.listenTo(detail, 'delete-action', function (data) {
                    me.trigger('delete-action', data);
                    removeDetail();
                });
                me.listenTo(detail, 'close-action', function (data) {
                    removeDetail();
                });
            },

            showFile: function (fileModel) {
                var me = this;
                var fileView = new FileView({
                    model: fileModel
                }).render();
                me.listenTo(fileView, 'photo-clicked', function (data) {
                    me.trigger('show-photo-details', data);
                    me.showDetails(data);
                });
                me.$('.photos-area').prepend(fileView.el);
            },

            initialize: function () {
                var me = this;
                me.listenTo(filesList, 'add', me.showFile);
            }
        });

        return new Container();
    });
}());
