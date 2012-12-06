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
define(['ApplicationChannel', 'ApplicationTemplates', 'util/DelayedTask',
    'view/GrowlNotification', 'util/Obj', 'util/I18N', 'util/Sequence', 'lib/jquery', 'view/FileView'],
    function (channel, templates, delayedTask, growl, utils, I18N, sequence) {
        function newObject(cfg) {
            var browserWindow = cfg.browserWindow;
            var containerId = sequence.next('app-container');
            var container = $(templates.getValue('application', {
                id: containerId
            }));
            var delayedContainerResize = delayedTask.newObject();

            browserWindow.on('resize', function () {
                delayedContainerResize.delay(updateContainerSize, 500);
            });

            browserWindow.on('keyup', function (ev) {
                var result = {
                    consumed: false
                };

                if (ev.keyCode === 18) { //ALT
                    result = channel.send('ui-actions', 'window-alt-released', {});
                } else if (ev.keyCode === 17) { //CONTROL
                    result = channel.send('ui-actions', 'window-ctrl-released', {});
                } else if (ev.keyCode === 16) { //SHIFT
                    result = channel.send('ui-actions', 'window-shift-released', {});
                }

                if (result.consumed) {
                    ev.preventDefault();
                }
            });

            browserWindow.on('keydown', function (ev) {
                var key = [],
                    keyStr = null;

                if (ev.altKey) {
                    key.push('alt');
                } else if (ev.ctrlKey) {
                    key.push('ctrl');
                } else if (ev.shiftKey) {
                    key.push('shift');
                }

                if (ev.keyCode !== 46 && // 'Delete' key
                    key.length === 0 && !(ev.keyCode >= 112 && ev.keyCode <= 123 || ev.keyCode === 27)) { // F1...F12 or esc
                    return; //nothing to do
                }

                keyStr = utils.keyCodeToString(ev.keyCode);
                if (!keyStr) {
                    keyStr = ev.keyCode;
                }
                key.push(keyStr);

                var result = channel.send('ui-actions', 'window-' + key.join('-') + '-pressed', {});
                if (result.consumed) {
                    ev.preventDefault();
                }
            });

            function updateContainerSize() {
                var containerHeight;
                var containerWidth;

                containerHeight = browserWindow.outerHeight();
                containerWidth = browserWindow.outerWidth();

                container.css('height', containerHeight + 'px');
                container.css('width', containerWidth + 'px');

                channel.send('ui-actions', 'container-resized', {
                    containerHeight: containerHeight,
                    containerWidth: containerWidth
                });
            }

            return {
                getContainerId: function () {
                    return containerId;
                },
                render: function () {
                    var body = $('body');
                    body.append(container);
                    delayedContainerResize.delay(updateContainerSize, 500);

                    channel.send('ui-actions', 'container-rendered', {
                        containerId: containerId
                    });
                }
            };
        };

        return {
            newObject: newObject
        };
    }
);