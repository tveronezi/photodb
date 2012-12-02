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
define(['ApplicationChannel', 'ApplicationTemplates', 'util/Sequence',
    'util/DelayedTask', 'lib/jquery'],
    function (channel, templates, sequence, delayedTask) {
        var container = $(templates.getValue('application-growl', {}));
        var myBody = $('body');
        var active = false;
        var timeout = {};

        function showNotification(params) {
            var messageType = params.messageType || 'success';
            var message = params.message;
            var autohide = (params.autohide !== false);
            var waitTime = params.timeout || 5000;

            if (!active) {
                active = true;
                myBody.append(container);
            }
            var alertId = sequence.next('alert');
            var alert = $(templates.getValue('application-growl-message', {
                alertId:alertId,
                messageType:'alert-' + messageType,
                message:message
            }));

            container.append(alert);
            alert.fadeIn();

            if (autohide === false) {
                // no-op
            } else {
                if (autohide === true) {
                    // no-op
                } else {
                    timeout = autohide;
                }
                timeout[alertId] = delayedTask();
                timeout[alertId].delay(function () {
                    try {
                        alert.fadeOut(null, function () {
                            try {
                                alert.remove();
                            } catch (e) { /* noop */
                            }
                        });
                    } catch (e) { /* noop */
                    }
                    delete timeout[alertId];
                }, waitTime);
            }
        }

        return {
            showNotification:showNotification
        };
    }
);