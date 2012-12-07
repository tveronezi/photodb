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

define(['view/FileView', 'ApplicationChannel', 'util/Sequence', 'lib/jquery'],
    function (FileView, channel, sequence) {
        describe('FileView test', function () {

            var testContainerId = sequence.next('TEST-CONTAINER');

            // Saving the 'window.setTimeout' function
            var originalSetTimeout = window.setTimeout;
            var originalClearTimeout = window.clearTimeout;

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

            it('should listen for "container-rendered" events', function () {
                channel.send('ui-actions', 'container-rendered', {
                    containerId: testContainerId
                });

                var counter = 0;
                var selection = $('#' + testContainerId).find('.svg-container')
                expect(selection.length).toBe(1);
            });

        });
    }
);
