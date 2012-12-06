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

/**
 * This is the application controller. This is the central point for logic and to forward actions to the views.
 * It contains all the views and model instances.
 */
"use strict";
define(['ApplicationChannel', 'ApplicationModel', 'view/ApplicationView', 'view/GrowlNotification', 'util/I18N'],
    function (channel, model, ApplicationView, growl, I18N) {
        function newObject() {

            channel.bind('file-manager', 'new-local-file', function (data) {
                var bean = {
                    cmdName: 'UploadPhoto',
                    x: data.x,
                    y: data.y,
                    localId: data.localId
                };
                bean[data.file.name] = data.file;
                model.sendMessage(bean);
                growl.showNotification({
                    message: I18N.get('photo.upload', {
                        fileName: data.file.name
                    })
                });
            });

            channel.bind('server-command-callback-success', 'UploadPhoto', function (data) {
                triggerPhotoDownload({
                    photoId: data.output.photoId,
                    localId: data.params.localId,
                    x: data.params.x,
                    y: data.params.y
                });
            });

            channel.bind('file-manager', 'delete-files', function (data) {
                model.sendMessage({
                    cmdName: 'DeletePhotos',
                    uids: data.uids.join(',')
                });
            });

            channel.bind('file-manager', 'get-file-bin', function (data) {
                triggerPhotoDownload(data);
            });

            function triggerPhotoDownload(data) {
                model.sendMessage({
                    cmdName: 'DownloadPhoto',
                    uid: data.photoId,
                    localId: data.localId,
                    x: data.x,
                    y: data.y
                });
            }

            channel.bind('server-command-callback-success', 'GetUser', function (data) {
                growl.showNotification({
                    message: I18N.get('application.welcome', {
                        appName: I18N.get('application.name'),
                        userName: data.output.name
                    })
                });
            });

            channel.bind('ui-actions', 'container-rendered', function () {
                model.sendMessage({
                    cmdName: 'GetUser'
                });

                if (window.File) {
                    growl.showNotification({
                        message: I18N.get('drag.photos.hint'),
                        timeout: 2000,
                        messageType: 'info'
                    });

                    model.sendMessage({
                        cmdName: 'GetPhotos'
                    });
                } else {
                    growl.showNotification({
                        message: I18N.get('html.support.error'),
                        autohide: false,
                        messageType: 'error'
                    });
                }
            });

            channel.bind('file-manager', 'update-photo-position', function (data) {
                // data.photoId, data.nx, data.ny
                model.sendMessage({
                    cmdName: 'UpdatePhotoPosition',
                    photoId: data.photoId,
                    x: data.nx,
                    y: data.ny
                });
            });

            var view = ApplicationView.newObject({
                browserWindow: $(window)
            });
            view.render();
        }

        return {
            newObject: newObject
        };
    }
);
