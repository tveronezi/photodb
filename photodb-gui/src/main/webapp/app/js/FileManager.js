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
 * This is the entry point for our javascript application.
 * DO NOT add any logic here. All business logic should be implemented in the ApplicationController object.
 */
"use strict";
define(['ApplicationChannel', 'util/Obj', 'util/Sequence', 'util/DelayedTask', 'lib/jquery'],
    function (channel, obj, sequence, delayedTask) {
        var DEFAULT_REQUEST_TIMEOUT = 1000;

        function newObject() {
            var updatePos = {};

            var photos = {};
            var triggerNewRemoteFile = delayedTask.newObject();

            channel.bind('ui-actions', 'delete-photos-trigger', function () {
                var uids = [];
                obj.forEachKey(photos, function (key, value) {
                    if (value.isSelected) {
                        uids.push(value.photoId);
                    }
                });

                if (uids.length > 0) {
                    channel.send('file-manager', 'delete-files', {
                        uids: uids
                    });
                }
            });

            channel.bind('server-command-callback-success', 'DeletePhotos', function (data) {
                var uids = data.params.uids.split(',');
                var changed = false;
                obj.forEach(uids, function (uid) {
                    if (photos[uid]) {
                        delete photos[uid];
                        changed = true;
                    }
                });

                if (changed) {
                    var photosArray = [];
                    obj.forEachKey(photos, function (key, value) {
                        photosArray.push(value);
                    });
                    channel.send('file-manager', 'files-updated', {
                        photos: photosArray
                    });
                }
            });

            channel.bind('server-command-callback-success', 'DownloadPhoto', function (data) {
                var params = data.params;
                photos[params.uid] = {
                    x: Number(data.params.x),
                    y: Number(data.params.y),
                    photoId: data.params.uid,
                    localId: sequence.next('file'),
                    href: 'data:image/png;base64,' + data.output.content
                };

                triggerNewRemoteFile.delay(function () {
                    var photosArray = [];
                    obj.forEachKey(photos, function (key, value) {
                        photosArray.push(value);
                    });
                    channel.send('file-manager', 'files-updated', {
                        photos: photosArray
                    });
                }, DEFAULT_REQUEST_TIMEOUT); // Wait 1s before sending this request

            });

            channel.bind('server-command-callback-success', 'GetPhotos', function (data) {
                obj.forEach(data.output, function (value) {
                    var itemData = {
                        localId: sequence.next('file'),
                        x: value.x,
                        y: value.y,
                        photoId: value.uid
                    };
                    channel.send('file-manager', 'get-file-bin', itemData);
                });
            });

            channel.bind('ui-actions', 'drag-photo', function (data) {
                // data.photoId, data.nx, data.ny
                var photoData = photos[data.photoId];
                if (!photoData) {
                    return;
                }
                photoData.x = data.nx;
                photoData.y = data.ny;

                var task = updatePos[data.photoId];
                if (!task) {
                    task = delayedTask.newObject();
                    updatePos[data.photoId] = task;
                }
                task.delay(function () {
                    channel.send('file-manager', 'update-photo-position', data);
                    delete updatePos[data.photoId];
                }, DEFAULT_REQUEST_TIMEOUT); // Wait 1s before sending this request
            });

            channel.bind('ui-actions', 'file-selection', function (data) {
                var photoData = photos[data.photoUid];
                if (!photoData) {
                    return;
                }
                if (photoData.isSelected) {
                    delete photoData.isSelected;
                } else {
                    photoData.isSelected = true;
                }

                var photosArray = [];
                obj.forEachKey(photos, function (key, value) {
                    if (photoData !== value) {
                        photosArray.push(value);
                    }
                });
                // This is the last guy to be plot
                photosArray.push(photoData);

                channel.send('file-manager', 'files-updated', {
                    photos: photosArray
                });
            });

            function handleFileSelect(files, x, y) {
                obj.forEach(files, function (f) {
                    // Only process image files.
                    if (!f.type.match('image.*')) {
                        return;
                    }

                    var reader = new window.FileReader();
                    reader.addEventListener('load', obj.bindScope({
                        x: x,
                        y: y,
                        f: f,
                        sequence: sequence,
                        channel: channel
                    }, function (e) {
                        this.channel.send('file-manager', 'new-local-file', {
                            evt: e,
                            x: this.x,
                            y: this.y,
                            file: this.f,
                            localId: this.sequence.next('file')
                        });
                    }));

                    // Read in the image file as a data URL.
                    reader.readAsDataURL(f);
                });
            }

            channel.bind('ui-actions', 'file-drop', function (data) {
                var evt = data.evt;
                var files = evt.dataTransfer.files;
                handleFileSelect(files, evt.clientX, evt.clientY);
            });
        }

        // Creating our singleton instance.
        newObject();

        return {
            newObject: newObject
        };
    }
);
