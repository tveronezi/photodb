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

define(['FileManager', 'ApplicationChannel', 'util/Obj'], function (FileManager, channel, obj) {

    describe('FileManager test', function () {
        var reqs = [
            {
                params: {
                    x: 1,
                    y: 2,
                    uid: 'myUid-A'
                },
                output: {
                    content: 'laia laia laia 1'
                }
            },
            {
                params: {
                    x: 3,
                    y: 4,
                    uid: 'myUid-B'
                },
                output: {
                    content: 'laia laia laia 2'
                }
            }
        ];

        // Saving the 'window.setTimeout' function
        var originalSetTimeout = window.setTimeout;
        var originalClearTimeout = window.clearTimeout;
        var originalFileReader = window.FileReader;

        beforeEach(function () {
            channel.unbindAll();
            FileManager.newObject();
        });

        afterEach(function () {
            channel.unbindAll();

            // Set the original setTimeout back
            window.setTimeout = originalSetTimeout;
            window.clearTimeout = originalClearTimeout;
            window.FileReader = originalFileReader;
        });

        it('should listen for successful "DownloadPhoto" requests', function () {
            // Mocking the setTimeout function
            window.setTimeout = function (callback) {
                callback();
            };

            var counter = 0;

            var uids = [
                ['myUid-A'],
                ['myUid-A', 'myUid-B']
            ];
            channel.bind('file-manager', 'files-updated', function (data) {
                counter++;

                expect(data).not.toBe(null);
                expect(data.uids).not.toBe(uids.pop());
            });

            // Mocking successful requests
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[0]);
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[1]);

            expect(counter).toEqual(2);
        });

        it('should listen for "file-selection" requests', function () {
            var executed = false;
            var photos = null;

            // Creating the photos
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[0]);
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[1]);

            function testMe(myUid, expectSelected) {
                executed = false;
                photos = null;
                channel.send('ui-actions', 'file-selection', {
                    photoUid: myUid
                });

                expect(executed).toBe(true);
                expect(photos.length).toBe(2);
                expect(photos[1].photoId).toBe(myUid); // the last guy on this list

                // "!!" translates undefined and null to false
                expect(!!photos[1].isSelected).toBe(expectSelected);
                expect(!!photos[0].isSelected).toBe(false);
            }

            channel.bind('file-manager', 'files-updated', function (data) {
                photos = data;
                executed = true;
            });

            testMe('myUid-A', true);
            testMe('myUid-A', false);
            testMe('myUid-B', true);
            testMe('myUid-B', false);

            executed = false;
            photos = null;
            channel.send('ui-actions', 'file-selection', {
                photoUid: 'UNKNOWN-UID'
            });
            expect(executed).toBe(false);
            expect(photos).toBe(null);
        });

        it('should listen for "delete-photos-trigger" requests', function () {
            var executed = false;
            var data = null;

            channel.bind('file-manager', 'delete-files', function (myData) {
                executed = true;
                data = myData;
            });

            // Creating the photos
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[0]);
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[1]);

            channel.send('ui-actions', 'delete-photos-trigger');
            expect(executed).toBe(false); // -> no file selected yet

            // select a file
            channel.send('ui-actions', 'file-selection', {
                photoUid: 'myUid-A'
            });

            channel.send('ui-actions', 'delete-photos-trigger');
            expect(executed).toBe(true);
            expect(data).not.toBe(null);
            expect(data.uids).toEqual(['myUid-A']);
        });

        it('should listen for successful "DeletePhotos" callbacks', function () {
            // Creating the photos
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[0]);
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[1]);

            var executed = false;
            var data = null;
            channel.bind('file-manager', 'files-updated', function (photosArray) {
                executed = true;
                data = photosArray;
            });

            channel.send('server-command-callback-success', 'DeletePhotos', {
                params: {
                    uids: ['UNKNOWN-UID'].join(',')
                }
            });
            expect(executed).toBe(false);

            channel.send('server-command-callback-success', 'DeletePhotos', {
                params: {
                    uids: ['UNKNOWN-UID', 'myUid-A'].join(',')
                }
            });

            expect(executed).toBe(true);
            expect(data).not.toBe(null);
            expect(data.length).toBe(1);
            expect(data[0].photoId).toEqual('myUid-B');
        });

        it('should listen for successful "GetPhotos" callbacks', function () {
            var executed = false;
            var uids = [];
            channel.bind('file-manager', 'get-file-bin', function (itemData) {
                executed = true;
                uids.push(itemData.photoId);
            });

            channel.send('server-command-callback-success', 'GetPhotos', {
                output: obj.collect(reqs, function (bean) {
                    return bean.params;
                })
            });

            expect(uids).toContain('myUid-A');
            expect(uids).toContain('myUid-B');
            expect(uids.length).toBe(2);
            expect(executed).toBe(true);
        });

        it('shoul listen for "drag-photo" events', function () {
            // Mocking the setTimeout function
            window.setTimeout = function (callback) {
                callback();
            };

            var eventData = null;
            channel.bind('file-manager', 'update-photo-position', function (data) {
                eventData = data;
            });

            var myData = {
                nx: 1,
                ny: 2,
                photoId: 'myID'
            };
            channel.send('file-manager', 'update-photo-position', myData);

            expect(eventData).toBe(myData);
        });

        it('should listen for "file-drop" events', function () {
            var callbacks = [];
            var files = [];

            // Mocking the window.FileReader "class"
            window.FileReader = function () {
            };
            window.FileReader.prototype.addEventListener = function (eventKey, eventCallback) {
                if (eventKey === 'load') {
                    callbacks.push(eventCallback);
                }
            };
            window.FileReader.prototype.readAsDataURL = function (myFile) {
                files.push(myFile);
            };

            var data = {
                evt: {
                    originalEvent: {
                        dataTransfer: {
                            files: [
                                {
                                    type: 'image/gif'
                                },
                                {
                                    type: 'video/3gpp'
                                }
                            ]
                        },
                        clientX: 10,
                        clientY: 20
                    }
                }
            };
            channel.send('ui-actions', 'file-drop', data);

            expect(files.length).toBe(1);
            expect(files[0]).toBe(data.evt.originalEvent.dataTransfer.files[0]);
            expect(callbacks.length).toBe(1);

            var executed = false;
            channel.bind('file-manager', 'new-local-file', function (callbackData) {
                expect(callbackData.x).toBe(10);
                expect(callbackData.y).toBe(20);
                expect(callbackData.file).toBe(data.evt.originalEvent.dataTransfer.files[0]);
                expect(callbackData.localId).toBeDefined();

                executed = true;
            });

            // Executing the "onload" callback
            callbacks[0]();
            expect(executed).toBe(true);
        });
    });
});
