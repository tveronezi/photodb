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

    var deps = ['ApplicationChannel', 'ApplicationTemplates', 'util/DelayedTask',
        'view/GrowlNotification', 'util/Obj', 'util/I18N', 'util/Sequence', 'lib/jquery', 'view/FileView'];

    define(deps, function (channel, templates, delayedTask, growl, utils, I18N, sequence) {

        function newObject(cfg) {
            var browserWindow = cfg.browserWindow;
            var containerId = sequence.next('app-container');
            var container = $(templates.getValue('application', {
                id: containerId
            }));
            var delayedContainerResize = delayedTask.newObject();

            // You need to create a new scope for this method.
            // The "this" object should have the "browserWindow" and the "channel" objects.
            var UpdateContainerSize = function (browserWindow, channel) {
                this.browserWindow = browserWindow;
                this.channel = channel;
                this.execute = function () {
                    var containerHeight;
                    var containerWidth;

                    containerHeight = this.browserWindow.outerHeight();
                    containerWidth = this.browserWindow.outerWidth();

                    container.css('height', containerHeight + 'px');
                    container.css('width', containerWidth + 'px');

                    this.channel.send('ui-actions', 'container-resized', {
                        containerHeight: containerHeight,
                        containerWidth: containerWidth
                    });
                };
            };

            function cleanOverflow() {
                container.removeClass('overflow-x-axe');
                container.removeClass('overflow-y-axe');
                container.removeClass('overflow-xy-axe');
            }

            browserWindow.on('resize', function () {
                var callback = new UpdateContainerSize(browserWindow, channel);
                delayedContainerResize.delay(function () {
                    callback.execute();
                }, 500);
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
                var key = [];
                var keyStr = null;

                if (ev.altKey) {
                    key.push('alt');
                }

                if (ev.ctrlKey) {
                    key.push('ctrl');
                }

                if (ev.shiftKey) {
                    key.push('shift');
                }

                // 'Delete' key - F1...F12 or esc
                if (ev.keyCode !== 46 && key.length === 0 && !((ev.keyCode >= 112 && ev.keyCode <= 123) || ev.keyCode === 27)) {
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

            channel.bind('ui-actions', 'svg-bigger-than-container-x', function () {
                cleanOverflow();
                container.addClass('overflow-x-axe');
            });
            channel.bind('ui-actions', 'svg-bigger-than-container-y', function () {
                cleanOverflow();
                container.addClass('overflow-y-axe');
            });
            channel.bind('ui-actions', 'svg-bigger-than-container-xy', function () {
                cleanOverflow();
                container.addClass('overflow-xy-axe');
            });
            channel.bind('ui-actions', 'svg-smaller-than-container', function () {
                cleanOverflow();
            });

            return {
                getContainerId: function () {
                    return containerId;
                },
                render: function () {
                    var body = $('body');
                    body.append(container);

                    var callback = new UpdateContainerSize(browserWindow, channel);
                    delayedContainerResize.delay(function () {
                        callback.execute();
                    }, 500);

                    channel.send('ui-actions', 'container-rendered', {
                        containerId: containerId
                    });
                }
            };
        }

        return {
            newObject: newObject
        };
    });
}());