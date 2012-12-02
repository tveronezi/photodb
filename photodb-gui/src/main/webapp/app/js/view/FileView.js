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

"use strict";
define(['ApplicationChannel', 'util/Sequence', 'util/Obj', 'ApplicationModel', 'FileManager', 'lib/jquery', 'lib/d3'],
    function (channel, sequence, obj, model) {
        var svgId = sequence.next('svg');

        function setDragBehaviour(imgEl) {
            var drag = d3.behavior.drag()
                .origin(Object)
                .on("drag", function () {
                    var d3Event = d3.event;
                    var nx = Number(imgEl.attr('x')) + d3Event.dx;
                    var ny = Number(imgEl.attr('y')) + d3Event.dy;
                    imgEl.attr('x', nx);
                    imgEl.attr('y', ny);
                })
                .on("dragend", function () {
                    channel.send('ui-actions', 'drag-photo', {
                        photoId:imgEl.attr('remote-id'),
                        nx:imgEl.attr('x'),
                        ny:imgEl.attr('y')
                    });
                });
            imgEl.call(drag);
        }

        channel.bind('server-command-callback-success', 'GetPhotos', function (data) {
            obj.forEach(data.output, function (value) {
                var itemData = {
                    localId:sequence.next('file'),
                    x:value.x,
                    y:value.y,
                    height:200,
                    width:200,
                    photoId:value.uid,
                    href:model.getUrlBase() + 'cmd?cmdName=DownloadPhoto&uid=' + value.uid
                };
                createFileItem(itemData);
            });
        });

        channel.bind('server-command-callback-success', 'UploadPhoto', function (data) {
            var imgEl = d3.select('#' + data.params.localId)
                .attr('remote-id', data.output.photoId);
            setDragBehaviour(imgEl);
        });

        channel.bind('ui-actions', 'container-rendered', function (data) {
            var svg = d3.select('#' + data.containerId)
                .append('svg')
                .attr('id', svgId)
                .attr('width', '1px')
                .attr('height', '1px');

            $('#' + svgId).on('drop', function (evt) {
                channel.send('ui-actions', 'file-drop', {
                    evt:evt
                });
            });
        });

        channel.bind('ui-actions', 'container-resized', function (data) {
            d3.select('#' + svgId)
                .attr('height', data.containerHeight + 'px')
                .attr('width', data.containerWidth + 'px');
        });

        channel.bind('file-manager', 'new-local-file', function (data) {
            var itemData = {
                localId:data.localId,
                x:data.x,
                y:data.y,
                height:200,
                width:200,
                href:data.evt.target.result
            };
            createFileItem(itemData);
        });

        function createFileItem(itemData) {
            var myImage = new Image();
            myImage.onload = function () {
                function calculateSize(original, atual, value) {
                    var ratio = atual / original;
                    return Math.round(ratio * value);
                }

                // "this" is the img tag.
                var max = Math.max(this.height, this.width);
                if (max === this.height && this.height > 200) {
                    itemData.width = calculateSize(this.height, itemData.height, this.width);
                } else if (this.width > 200) {
                    itemData.height = calculateSize(this.width, itemData.width, this.height);
                }

                var imgEl = d3.select('#' + svgId).append('image')
                imgEl.attr('id', itemData.localId)
                    .attr('x', itemData.x)
                    .attr('y', itemData.y)
                    .attr('height', itemData.height + 'px')
                    .attr('width', itemData.width + 'px')
                    .attr('xlink:href', itemData.href);
                if (itemData.photoId) {
                    imgEl.attr('remote-id', itemData.photoId);
                    setDragBehaviour(imgEl);
                }
            };
            myImage.src = itemData.href;
        }
    }
);