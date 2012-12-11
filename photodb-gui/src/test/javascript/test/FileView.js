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

define(['view/FileView', 'ApplicationChannel', 'util/Sequence', 'lib/jquery', 'lib/d3'],
    function (FileView, channel, sequence) {
        describe('FileView test', function () {

            var testContainerId = sequence.next('TEST-CONTAINER');

            // Saving the original stuff
            var originalSetTimeout = window.setTimeout;
            var originalClearTimeout = window.clearTimeout;

            var oSelectionPrototypeOnFunction = d3.selection.prototype.on;
            var oD3Rebind = d3.rebind;

            beforeEach(function () {
                channel.unbindAll();
                $('#' + testContainerId).remove();
                var container = $('<div></div>').attr('id', testContainerId);
                container.appendTo($('body'));
                FileView.newObject();
            });

            afterEach(function () {
                // Set the original setTimeout back
                window.setTimeout = originalSetTimeout;
                window.clearTimeout = originalClearTimeout;
                d3.selection.prototype.on = oSelectionPrototypeOnFunction;
                d3.rebind = oD3Rebind;
                channel.unbindAll();
                $('#' + testContainerId).remove();
            });

            it('should listen for "window-delete-pressed" events', function () {
                var executed = false;
                channel.bind('ui-actions', 'delete-photos-trigger', function () {
                    executed = true;
                });
                channel.send('ui-actions', 'window-delete-pressed');
                expect(executed).toBe(executed);
            });

            it('should listen for "container-rendered" and "drop" events', function () {
                var dropCallback = null;
                var onWrapper = function (type, listener, capture) {
                    if (type === 'drop') {
                        dropCallback = listener;
                    }
                    return oSelectionPrototypeOnFunction.call(this, type, listener, capture);
                }
                d3.selection.prototype.on = onWrapper;

                channel.send('ui-actions', 'container-rendered', {
                    containerId: testContainerId
                });

                var counter = 0;
                var selection = $('#' + testContainerId).find('.svg-container')
                expect(selection.length).toBe(1);
                expect(dropCallback).not.toBe(null);


                var preventDefaultExecuted = false;
                var myEvt = {
                    preventDefault: function () {
                        preventDefaultExecuted = true;
                    }
                };
                d3.event = myEvt;

                var fileDropExecuted = false;
                channel.bind('ui-actions', 'file-drop', function (myData) {
                    expect(myData.evt).toBe(myEvt);
                    fileDropExecuted = true;
                });
                dropCallback();

                expect(preventDefaultExecuted).toBe(true);
                expect(fileDropExecuted).toBe(true);
            });


            it('should listen for "files-updated" events', function () {
                var callbacks = {};
                d3.rebind = function (target, source) {
                    callbacks.drag = source.drag;
                    callbacks.dragend = source.dragend;
                    return oD3Rebind.apply(this, arguments);
                };

                // creating the svg element
                channel.send('ui-actions', 'container-rendered', {
                    containerId: testContainerId
                });

                var fileData = [
                    {
                        localId: 'myLocalA',
                        href: 'http://goo.gl/Shp7b',
                        x: 20,
                        y: 20
                    },
                    {
                        localId: 'myLocalB',
                        href: 'http://goo.gl/Shp7b',
                        x: 20,
                        y: 20,
                        isSelected: true
                    },
                    {
                        localId: 'myLocalC',
                        href: 'http://goo.gl/Shp7b',
                        x: 20,
                        y: 20,
                        photoId: 'MyPhotoId'
                    }
                ];
                channel.send('file-manager', 'files-updated', {
                    photos: fileData
                });

                var myContainer = $('#' + testContainerId);
                expect(myContainer.find('.file-item').length).toBe(3);
                expect(myContainer.find('.selected').length).toBe(1);

                expect(callbacks.drag).toBeDefined();
                d3.event.dx = 100;
                d3.event.dy = 200;
                // We are going to call the drag event in the last node
                callbacks.drag();
                expect(fileData[2].x).toBe(120);
                expect(fileData[2].y).toBe(220);

                expect(callbacks.dragend).toBeDefined();
                var dragPhotoExecuted = false;
                channel.bind('ui-actions', 'drag-photo', function (d) {
                    dragPhotoExecuted = true;
                    expect(d.photoId).toBe('MyPhotoId');
                    expect(d.nx).toBe(120);
                    expect(d.ny).toBe(220);
                });

                callbacks.dragend();
                expect(dragPhotoExecuted).toBe(true);
            });

        });
    }
);
