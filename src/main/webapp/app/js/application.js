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

    var deps = [
        'app/js/view/container', 'app/js/view/files', 'app/js/view/about', 'app/js/view/login',
        'app/js/model/files', 'app/js/model/file', 'app/js/view/growl',
        'lib/underscore',
        'app/js/i18n',
        'lib/less', 'lib/backbone', 'lib/jquery', 'lib/bootstrap',
        'app/js/keep-alive'
    ];
    define(deps, function (containerView, filesView, aboutView, LoginView, filesList, FileModel, growl, underscore, i18n) {
        $.ajaxSetup({ cache: false });

        function start() {
            function fetchFiles() {
                filesList.fetch();
            }

            fetchFiles();

            //Starting the backbone router.
            var Router = Backbone.Router.extend({
                routes: {
                    '': 'showFiles',
                    'files': 'showFiles',
                    'about': 'showAbout'
                },

                showFiles: function () {
                    containerView.render();
                    containerView.showView(filesView);
                },

                showAbout: function () {
                    containerView.render();
                    containerView.showView(aboutView);
                }
            });
            var router = new Router();

            function setUserName(userName) {
                if (!userName || userName.trim() === '') {
                    window.document.title = i18n.get('application.name');
                } else {
                    window.document.title = i18n.get('application.name') + ' [' + userName + ']';
                }
            }

            function setLoggedUser(userName) {
                if (!userName || userName === '') {
                    return;
                }
                containerView.setSignMode('signout');
                setUserName(userName);
                fetchFiles();
            }

            $.ajax({
                type: 'GET',
                'url': window.ux.ROOT_URL + 'rest/user/info',
                data: {},
                success: function (result, status, xhr) {
                    if (result && result.userInfo) {
                        setLoggedUser(result.userInfo.name);
                    }

                },
                error: function (xhr, status, err) {
                    growl.showNotification('danger', i18n.get('user.info.error', {}));
                }
            });

            containerView.on('navigate', function (data) {
                router.navigate(data.href, {
                    trigger: true
                });
            });

            containerView.on('signin', function (data) {
                var loginView = new LoginView({});
                loginView.on('login-action', function (data) {
                    var authenticationPath = window.ux.ROOT_URL + 'rest/user/authenticate';
                    $.ajax({
                        type: 'POST',
                        'url': authenticationPath,
                        data: data,
                        success: function (result, status, xhr) {
                            setLoggedUser(data.j_username);
                            growl.showNotification('success', i18n.get('application.welcome', {
                                userName: data.j_username,
                                appName: i18n.get('application.name')
                            }));
                        },
                        error: function (xhr, status, err) {
                            if (String(xhr.status) === '404') {
                                growl.showNotification('danger', i18n.get('404', {
                                    resource: authenticationPath
                                }));
                            } else {
                                growl.showNotification('danger', i18n.get('bad.user.password', {}));
                            }
                        }
                    });
                });
                loginView.on('create-user-action', function (data) {
                    $.ajax({
                        type: 'POST',
                        url: window.ux.ROOT_URL + 'rest/user/new',
                        data: data,
                        success: function (result, status, xhr) {
                            growl.showNotification('success', i18n.get('new.user.requested', {}));
                            growl.showNotification('success', i18n.get('new.user.requested.instructions', {
                                email: data.j_username
                            }));
                        }
                    });
                });
                loginView.render();
            });

            containerView.on('signout', function (data) {
                $.ajax({
                    type: 'POST',
                    url: window.ux.ROOT_URL + 'rest/user/signout',
                    data: data,
                    success: function (result, status, xhr) {
                        window.location.reload();
                    }
                });
            });

            filesView.on('delete-action', function (data) {
                filesList.remove(data.model);
                data.model.destroy();
            });

            function saveFile(file) {
                var newFile = new FileModel({
                    'name': file.name,
                    'contentType': file.contentType,
                    'content': file.content,
                    'publicData': false
                });
                newFile.save({}, {
                    success: function (model) {
                        filesList.add(model);
                    }
                });
            }

            filesView.on('file-drop', function (data) {
                underscore.each(data.files, function (f) {
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

            filesView.on('show-photo-details', function (data) {
                data.model.fetch({});
            });

            //Starting the backbone history.
            Backbone.history.start({
                pushState: true,
                root: window.ux.ROOT_URL // This value is set by <c:url>
            });

            setUserName('');

            return {
                getRouter: function () {
                    return router;
                }
            };
        }

        return {
            start: start
        };
    });
}());