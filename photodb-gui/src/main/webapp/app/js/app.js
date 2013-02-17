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

require.config(APP_CONFIG);

(function () {
    'use strict';

    var deps = ['app/js/views', 'app/js/models', 'lib/less', 'lib/backbone'];
    requirejs(deps, function (views, models) {
            $(document).ready(function () {
                var menuModel = models.newInstance('menu');
                var filesList = (function () {
                    var Cls = Backbone.Collection.extend({
                        model: models.getClass('file')
                    });
                    return new Cls();
                }());

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

                filesView.on('delete-action', function(data) {
                    filesList.remove(data.model);
                    data.model.destroy();
                });

                filesView.on('file-drop', function (data) {
                    _.each(data.files, function (f) {
                        // Only process image files.
                        if (!f.type.match('image.*')) {
                            return;
                        }

                        var myFile = {
                            name: f.name,
                            size: f.size
                        };

                        var reader = new window.FileReader();
                        reader.addEventListener('load', function (evt) {
                            myFile.src = evt.target.result;
                            filesList.add(myFile);
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
            });
        }
    );
}());