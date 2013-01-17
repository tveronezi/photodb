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

    var deps = ['ApplicationChannel', 'ApplicationTemplates', 'util/Sequence', 'util/DelayedTask', 'lib/jquery'];

    define(deps, function (channel, templates, sequence, delayedTask) {
        var container = $(templates.getValue('application-growl', {}));
        var myBody = $('body');
        var active = false;
        var timeout = {};

        function showNotification(params) {
            var messageType = params.messageType || 'success';
            var message = params.message;
            var autohide = (params.autohide !== false);
            var waitTime = params.timeout || 5000;
            var alertId = params.id || sequence.next('alert');

            if (!active) {
                active = true;
                myBody.append(container);
                channel.send('notification', 'activating-notifications');
            }

            function removeAlert() {
                try {
                    var alert = $('#' + alertId);
                    alert.fadeOut(null, function () {
                        try {
                            alert.remove();
                        } catch (e) {
                            window.console.error(e);
                        }
                    });
                } catch (e) {
                    window.console.error(e);
                }
                delete timeout[alertId];
                channel.send('notification', 'alert-removed', {
                    alertId: alertId
                });
            }

            if (timeout[alertId]) {
                channel.send('notification', 'alert-delay', {
                    alertId: alertId
                });
                timeout[alertId].delay(removeAlert, waitTime);
            } else {
                var alert = $(templates.getValue('application-growl-message', {
                    alertId: alertId,
                    messageType: 'alert-' + messageType,
                    message: message
                }));
                container.append(alert);
                alert.fadeIn();

                channel.send('notification', 'new-alert', params);

                var empty = (autohide === undefined || autohide === null);
                if (autohide || empty) {
                    timeout[alertId] = delayedTask.newObject();
                    timeout[alertId].delay(removeAlert, waitTime);
                    if (empty) {
                        timeout = autohide;
                    }
                }
            }
        }

        return {
            showNotification: showNotification
        };
    });
}());
