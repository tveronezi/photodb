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
define(['ApplicationChannel', 'util/Sequence', 'FileManager', 'lib/jquery', 'lib/d3'],
    function (channel, sequence) {
        var svgId = sequence.next('svg');

        channel.bind('server-command-callback-success', 'GetPhotos', function (data) {
            var a = 0;
        });

        channel.bind('server-command-callback-success', 'upload-file', function (data) {
            var svg = d3.select('#' + data.localId)
                .attr('remote-id', data.photoId);
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

                var drag = d3.behavior.drag()
                    .origin(Object)
                    .on("drag", function () {
                        var d3Event = d3.event;
                        var imgEl = d3.select(this);
                        imgEl.attr('x', Number(imgEl.attr('x')) + d3Event.dx);
                        imgEl.attr('y', Number(imgEl.attr('y')) + d3Event.dy);
                    });

                d3.select('#' + svgId)
                    .append('image')
                    .attr('id', itemData.localId)
                    .attr('x', itemData.x)
                    .attr('y', itemData.y)
                    .attr('height', itemData.height + 'px')
                    .attr('width', itemData.width + 'px')
                    .attr('xlink:href', itemData.href)
                    .call(drag);
            };
            myImage.src = itemData.href;
        });
    }
);