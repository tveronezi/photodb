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
define(['ApplicationChannel', 'util/Sequence', 'util/Obj', 'view/GrowlNotification', 'util/I18N', 'FileManager', 'lib/jquery', 'lib/d3'],
    function (channel, sequence, obj, growl, I18N) {
        var svgId = sequence.next('svg');
        var deleteNotificationId = sequence.next('delete-notif');

        channel.bind('ui-actions', 'window-delete-pressed', function () {
            channel.send('ui-actions', 'delete-photos-trigger', {});
        });

        function translate(g, dx, dy) {
            g.attr('transform', function (d) {
                d.x = d.x + (dx ? dx : 0);
                d.y = d.y + (dy ? dy : 0);
                return 'translate(' + d.x + ',' + d.y + ')';
            });
        }

        function setDragBehaviour(g) {
            var drag = d3.behavior.drag()
                .origin(Object)
                .on("drag", function () {
                    var d3Event = d3.event;
                    translate(g, d3Event.dx, d3Event.dy);
                })
                .on("dragend", function () {
                    // TODO: "g.data(function(d) {})" is not working. Why?
                    // We won't create the element 'i'. This is just a workaround to get the node's data.
                    g.attr('i', function(d) {
                        channel.send('ui-actions', 'drag-photo', {
                            photoId: d.photoId,
                            nx: d.x,
                            ny: d.y
                        });
                    })
                });
            g.call(drag);
        }

        channel.bind('ui-actions', 'container-rendered', function (data) {
            var svg = d3.select('#' + data.containerId)
                .append('svg')
                .classed('svg-container', true)
                .attr('id', svgId)
                .attr('width', '1px')
                .attr('height', '1px');


            $('#' + svgId).on('dragover', function (evt) {
                evt.preventDefault();
            });

            $('#' + svgId).on('drop', function (evt) {
                evt.preventDefault();
                channel.send('ui-actions', 'file-drop', {
                    evt: evt
                });
            });
        });

        channel.bind('ui-actions', 'container-resized', function (data) {
            d3.select('#' + svgId)
                .attr('height', data.containerHeight + 'px')
                .attr('width', data.containerWidth + 'px');
        });

        channel.bind('file-manager', 'files-updated', function (data) {
            createFileItems(data);
        });

        function setSelectBehaviour(g) {
            g.on('click', function () {
                // TODO: "g.data(function(d) {})" is not working. Why?
                // We won't create the element 'i'. This is just a workaround to get the node's data.
                d3.select(this).attr('i', function(d) {
                    channel.send('ui-actions', 'file-selection', {
                        photoUid: d.photoId
                    });
                });

                growl.showNotification({
                    id: deleteNotificationId,
                    message: I18N.get('photo.delete.tip')
                });
            });
        }

        function createFileItems(data) {
            var svg = d3.select('#' + svgId);
            svg.selectAll('g').remove();

            var gSelection = svg.selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr('id', function (d) {
                    return d.localId;
                })
                .classed('file-item', true);

            gSelection.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('rx', 20)
                .attr('ry', 20)
                .attr('height', '202px')
                .attr('width', '202px')
                .classed('selected', function (d) {
                    return !(!d.isSelected);
                });


            gSelection.append('image')
                .attr('x', 10)
                .attr('y', 10)
                .attr('height', '180px')
                .attr('width', '180px')
                .attr('xlink:href', function (d) {
                    return d.href;
                });

            obj.forEach(data, function (d) {
                var g = d3.select('#' + d.localId);

                if (d.photoId) {
                    setDragBehaviour(g);
                }
                translate(g);
                setSelectBehaviour(g);
            });
        }
    }
)
;