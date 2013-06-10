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
    define(deps, function (filesList, templates, underscore) {

        var FileDetailsView = Backbone.View.extend({
            el: function () {
                return $('<div class="modal" tabindex="-1" role="dialog"></div>');
            },

            events: {
                'click .close-modal': function () {
                    var me = this;
                    me.$el.modal('hide');
                },
                'click .delete-action': function () {
                    var me = this;
                    me.trigger('delete-action', {
                        model: me.model
                    });
                }
            },

            render: function () {
                var me = this;

                me.$el.empty();
                var html = templates.getValue('file-details', {
                    content: me.model.get('content'),
                    name: me.model.get('name')
                });
                me.$el.html(html);
                me.$el.bind('hidden', function () {
                    me.remove();
                });

                return me;
            },

            initialize: function () {
                var me = this;
                me.listenTo(this.model, 'destroy', function () {
                    me.$el.modal('hide');
                });
                me.listenTo(this.model, 'change', function () {
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

                me.$el.empty();
                var html = templates.getValue('file', {
                    content: me.model.get('content'),
                    name: me.model.get('name')
                });
                me.$el.html(html);

                return me;
            },

            initialize: function () {
                var me = this;
                me.listenTo(this.model, 'destroy', function () {
                    me.remove();
                });
            }
        });

        var View = Backbone.View.extend({
            tagName: 'div',
            className: 'photos',

            render: function () {
                if (this.options.isRendered) {
                    return;
                }

                var me = this;

                me.$el.empty();
                var html = templates.getValue('files');
                me.$el.html(html);

                var dropZone = me.$('.drop-area')[0];
                dropZone.addEventListener('dragover', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    evt.dataTransfer.dropEffect = 'copy';
                }, false);
                dropZone.addEventListener('drop', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    var files = evt.dataTransfer.files;
                    me.trigger('file-drop', {
                        files: files
                    });
                }, false);

                var dropZoneEl = $(dropZone);
                dropZoneEl.detach();
                this.options.dropZone = dropZoneEl;
                this.options.isRendered = true;
                return this;
            },

            showDropZone: function () {
                this.$el.prepend(this.options.dropZone);
            },

            showDetails: function (data) {
                var me = this;
                var detailsView = new FileDetailsView({
                    model: data.model
                }).render();
                me.listenTo(detailsView, 'delete-action', function (data) {
                    me.trigger('delete-action', data);
                });
                me.$('.details-area').append(detailsView.el);
                detailsView.$el.modal({});
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

        return new View();
    });
}());


