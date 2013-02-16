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

    var deps = ['ApplicationChannel', 'util/Sequence', 'util/Obj', 'view/GrowlNotification', 'util/I18N',
        'ApplicationTemplates', 'FileManager', 'lib/jquery'];

    define(deps, function (channel, sequence, obj, growl, I18N, templates) {
        function newObject() {
            var svgMinHeight = 1;
            var svgMinWidth = 1;
            var containerHeight = 0;
            var containerWidth = 0;

            var svg = $(templates.getValue('photos', {}));

            var deleteNotificationId = sequence.next('delete-notif');

            channel.bind('ui-actions', 'window-delete-pressed', function () {
                channel.send('ui-actions', 'delete-photos-trigger', {});
            });

            channel.bind('ui-actions', 'container-rendered', function (data) {
                data.container.append(svg);
                data.container.on('dragover', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                data.container.on('dragenter', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                data.container.on('drop', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    channel.send('ui-actions', 'file-drop', {
                        evt: e.originalEvent
                    });
                });
            });

            function fitContent() {
                var height = Math.max(containerHeight, svgMinHeight);
                var width = Math.max(containerWidth, svgMinWidth);
                var eventData = {
                    svgMinHeight: svgMinHeight,
                    svgMinWidth: svgMinWidth,
                    containerHeight: containerHeight,
                    containerWidth: containerWidth
                };
                svg.attr('height', height + 'px')
                    .attr('width', width + 'px');
                if (containerWidth < svgMinWidth || containerHeight < svgMinHeight) {
                    if (containerWidth < svgMinWidth && containerHeight < svgMinHeight) {
                        channel.send('ui-actions', 'svg-bigger-than-container-xy', eventData);
                    } else if (containerWidth < svgMinWidth) {
                        channel.send('ui-actions', 'svg-bigger-than-container-x', eventData);
                    } else if (containerHeight < svgMinHeight) {
                        channel.send('ui-actions', 'svg-bigger-than-container-y', eventData);
                    }
                } else {
                    if (containerWidth > svgMinWidth && containerHeight > svgMinHeight) {
                        channel.send('ui-actions', 'svg-smaller-than-container', eventData);
                    }
                }
            }

            function createFileItems(data) {
                svg.empty();
                obj.forEach(data.photos, function (photo) {
                    var img = $(templates.getValue('photo-preview', {
                        src: photo.href,
                        localId: photo.localId,
                        photoId: photo.photoId,
                        caption: photo.name
                    }));
                    svg.append(img);
                });
            }

            channel.bind('ui-actions', 'container-resized', function (data) {
                containerHeight = data.containerHeight;
                containerWidth = data.containerWidth;
                fitContent();
            });

            channel.bind('file-manager', 'files-updated', function (data) {
                createFileItems(data);
            });
        }

        // Creating our singleton
        newObject();

        return {
            newObject: newObject
        };
    });
}());