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
        var updatePos = {};

        channel.bind('ui-actions', 'drag-photo', function (data) {
            // data.photoId, data.nx, data.ny
            var task = updatePos[data.photoId];
            if (!task) {
                task = delayedTask();
                updatePos[data.photoId] = task;
            }
            task.delay(function () {
                channel.send('file-manager', 'update-photo-position', data);
                delete updatePos[data.photoId];
            }, 1000); // Wait 1s before sending this request
        });

        function handleFileSelect(files, x, y) {
            obj.forEach(files, function (f) {
                // Only process image files.
                if (!f.type.match('image.*')) {
                    return;
                }

                var reader = new FileReader();
                reader.onload = function (e) {
                    channel.send('file-manager', 'new-local-file', {
                        evt:e,
                        x:x,
                        y:y,
                        file:f,
                        localId:sequence.next('file')
                    });
                };
                // Read in the image file as a data URL.
                reader.readAsDataURL(f);
            });
        }

        channel.bind('ui-actions', 'file-drop', function (data) {
            var evt = data.evt;
            evt.stopPropagation();
            evt.preventDefault();
            var files = evt.originalEvent.dataTransfer.files;
            handleFileSelect(files, evt.originalEvent.clientX, evt.originalEvent.clientY);
        });
    }
);
