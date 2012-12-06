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

define(['ApplicationController', 'ApplicationChannel', 'ApplicationModel', 'util/Obj', 'view/ApplicationView',
    'view/GrowlNotification', 'util/I18N'],
    function (ApplicationController, channel, model, obj, ApplicationView, growl, I18N) {

        describe('ApplicationController test', function () {
            var oSendMessage = model.sendMessage;
            var oApplicationViewNewObject = ApplicationView.newObject;
            var oShowNotification = growl.showNotification;
            var oFileConstructor = window.File;

            beforeEach(function () {
                var noop = function () {
                    // no op
                };

                ApplicationView.newObject = function () {
                    return {
                        render: noop
                    };
                }
                growl.showNotification = noop;
                channel.unbindAll();
            });

            afterEach(function () {
                // Setting orinial functions back
                model.sendMessage = oSendMessage;
                ApplicationView.newObject = oApplicationViewNewObject;
                growl.showNotification = oShowNotification;
                window.File = oFileConstructor;
                channel.unbindAll();
            });

            it('should send a UploadPhoto request', function () {
                ApplicationController.newObject();

                var myBean = null;
                model.sendMessage = function (bean) {
                    myBean = bean;
                };

                var file = {
                    name: 'myFileName'
                };
                channel.send('file-manager', 'new-local-file', {
                    file: file,
                    x: 1,
                    y: 2,
                    localId: 'myLocalId'
                });

                expect(myBean).not.toBe(null);
                expect(myBean.cmdName).toEqual('UploadPhoto');
                expect(myBean.x).toEqual(1);
                expect(myBean.y).toEqual(2);
                expect(myBean.localId).toEqual('myLocalId');
                expect(myBean[file.name]).toEqual(file);
            });

            it('should listen for successful uploads', function () {
                ApplicationController.newObject();

                var myBean = null;
                model.sendMessage = function (bean) {
                    myBean = bean;
                };

                channel.send('server-command-callback-success', 'UploadPhoto', {
                    output: {
                        photoId: 'myPhotoId'
                    },
                    params: {
                        x: 1,
                        y: 2,
                        localId: 'myLocalId'
                    }
                });

                expect(myBean).not.toBe(null);
                expect(myBean.cmdName).toEqual('DownloadPhoto');
                expect(myBean.uid).toEqual('myPhotoId');
                expect(myBean.localId).toEqual('myLocalId');

                expect(myBean.x).toEqual(1);
                expect(myBean.y).toEqual(2);
            });

            it('should listen for "get-file-bin" requests', function () {
                ApplicationController.newObject();

                var myBean = null;
                model.sendMessage = function (bean) {
                    myBean = bean;
                };

                channel.send('file-manager', 'get-file-bin', {
                    x: 1,
                    y: 2,
                    photoId: 'myUid',
                    localId: 'myLocalUid'
                });

                expect(myBean).not.toBe(null);
                expect(myBean.cmdName).toEqual('DownloadPhoto');
                expect(myBean.uid).toEqual('myUid');
                expect(myBean.localId).toEqual('myLocalUid');
                expect(myBean.x).toEqual(1);
                expect(myBean.y).toEqual(2);
            });

            it('should listen for delete requests', function () {
                ApplicationController.newObject();

                var myBean = null;
                model.sendMessage = function (bean) {
                    myBean = bean;
                };

                channel.send('file-manager', 'delete-files', {
                    uids: [1, 2, 3, 4, 5, 6]
                });

                expect(myBean).not.toBe(null);
                expect(myBean.cmdName).toEqual('DeletePhotos');
                expect(myBean.uids).toEqual('1,2,3,4,5,6');
            });

            it('should listen for successful GetUser requests', function () {
                ApplicationController.newObject();

                var notification = null;
                growl.showNotification = function (params) {
                    notification = params.message;
                };

                channel.send('server-command-callback-success', 'GetUser', {
                    output: {
                        name: 'My Master'
                    }
                });

                expect(notification).not.toBe(null);
                expect(notification).toEqual('Hi My Master! Welcome to photodb!');
            });


            it('should listen for "container-rendered" events', function () {
                ApplicationController.newObject();

                var commands = [];
                model.sendMessage = function (bean) {
                    commands.push(bean.cmdName);
                };

                var notification = null;
                growl.showNotification = function (params) {
                    notification = params.message;
                };

                channel.send('ui-actions', 'container-rendered');
                expect(notification).toEqual(I18N.get('drag.photos.hint'));
                expect(commands.join(',')).toEqual('GetUser,GetPhotos');

                notification = null;
                commands = [];
                window.File = null;

                channel.send('ui-actions', 'container-rendered');
                expect(notification).toEqual(I18N.get('html.support.error'));
                expect(commands.join(',')).toEqual('GetUser');
            });


            it('should listen for "update-photo-position" requests', function () {
                ApplicationController.newObject();

                var myBean = null;
                model.sendMessage = function (bean) {
                    myBean = bean;
                };

                channel.send('file-manager', 'update-photo-position', {
                    photoId: 'myUid',
                    nx: 1,
                    ny: 2
                });

                expect(myBean).not.toBe(null);
                expect(myBean.cmdName).toEqual('UpdatePhotoPosition');
                expect(myBean.photoId).toEqual('myUid');
                expect(myBean.x).toEqual(1);
                expect(myBean.y).toEqual(2);
            });
        });
    }
);
