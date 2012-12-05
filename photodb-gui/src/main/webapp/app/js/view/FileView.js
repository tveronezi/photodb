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

        var selectedPhotos = [];

        function translate(g, dx, dy) {
            var nx = Number(g.attr('gx')) + dx;
            var ny = Number(g.attr('gy')) + dy;
            var str = 'translate(' + nx + ',' + ny + ')';
            g.attr('transform', str);
            g.attr('gx', nx);
            g.attr('gy', ny);
        }

        function setDragBehaviour(img) {
            var g = d3.select('#' + img.attr('id') + '-G');
            var drag = d3.behavior.drag()
                .origin(Object)
                .on("drag", function () {
                    var d3Event = d3.event;
                    translate(g, d3Event.dx, d3Event.dy);
                })
                .on("dragend", function () {
                    channel.send('ui-actions', 'drag-photo', {
                        photoId:img.attr('remote-id'),
                        nx:g.attr('gx'),
                        ny:g.attr('gy')
                    });
                });
            g.call(drag);
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
                .classed('svg-container', true)
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
                href:data.evt.target.result
            };
            createFileItem(itemData);
        });

        function setSelectBehaviour(img) {
            var id = img.attr('id');
            var g = d3.select('#' + id + '-G');

            g.on('click', function () {
                var index = selectedPhotos.indexOf(id);
                if (index < 0) {
                    selectedPhotos.push(id);
                    g.select('rect').classed('selected', true);
                } else {
                    selectedPhotos.splice(index, 1);
                    g.select('rect').classed('selected', false);
                }
            });
        }

        function createFileItem(itemData) {
            var myImage = new Image();
            myImage.onload = function () {
                var g = d3.select('#' + svgId).append('g');
                g.attr('id', itemData.localId + '-G')
                    .classed('file-item', true);

                g.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('rx', 20)
                    .attr('ry', 20)
                    .attr('height', '202px')
                    .attr('width', '202px');

                var imgEl = g.append('image');
                imgEl.attr('id', itemData.localId)
                    .attr('x', 10)
                    .attr('y', 10)
                    .attr('height', '180px')
                    .attr('width', '180px')
                    .attr('xlink:href', itemData.href);
                if (itemData.photoId) {
                    imgEl.attr('remote-id', itemData.photoId);
                    setDragBehaviour(imgEl);
                }
                translate(g, itemData.x, itemData.y);

                setSelectBehaviour(imgEl);
            };
            myImage.src = itemData.href;
        }
    }
);