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

    var deps = ['app/js/views', 'app/js/models', 'lib/less', 'lib/backbone'];
    define(deps, function (views, models) {

        function start() {
            var menuModel = models.newInstance('menu');
            var filesList = models.newInstance('files');
            filesList.fetch({
                success: function (collection, response, options) {
                    _.each(response.photoDto, function (dto) {
                        filesList.add(dto);
                    });
                }
            });

            var containerView = views.newInstance('container', {
                menuModel: menuModel
            });
            var filesView = views.newInstance('files', {
                model: filesList
            }).render();
            var aboutView = views.newInstance('about').render();

            //Starting the backbone router.
            var Router = Backbone.Router.extend({
                routes: {
                    '': 'showFiles',
                    'files': 'showFiles',
                    'about': 'showAbout'
                },

                showFiles: function () {
                    containerView.render();
                    menuModel.set({
                        'files': 'active',
                        'about': ''
                    });
                    containerView.showView(filesView);
                },

                showAbout: function () {
                    containerView.render();
                    menuModel.set({
                        'files': '',
                        'about': 'active'
                    });
                    containerView.showView(aboutView);
                }
            });
            var router = new Router();

            containerView.on('navigate', function (data) {
                router.navigate(data.href, {
                    trigger: true
                });
            });

            filesView.on('delete-action', function (data) {
                filesList.remove(data.model);
                data.model.destroy();
            });

            function saveFile(file) {
                var newFile = models.newInstance('file', {
                    'name': file.name,
                    'contentType': file.contentType,
                    'content': file.content,
                    'publicData': false
                });
                filesList.add(newFile);
                newFile.save();
            }

            filesView.on('file-drop', function (data) {
                _.each(data.files, function (f) {
                    // Only process image files.
                    if (!f.type.match('image.*')) {
                        return;
                    }

                    var myFile = {
                        name: f.name,
                        contentType: f.type
                    };

                    var reader = new window.FileReader();
                    reader.addEventListener('load', function (evt) {
                        myFile.content = evt.target.result;
                        saveFile(myFile);
                    });

                    // Read in the image file as a data URL.
                    reader.readAsDataURL(f);
                });
            });

            //Starting the backbone history.
            Backbone.history.start({
                pushState: true,
                root: ROOT_URL // This value is set by <c:url>
            });
        }

        return {
            start: start
        };
    });
}());