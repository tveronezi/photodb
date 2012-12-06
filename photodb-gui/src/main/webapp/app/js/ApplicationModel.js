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
define(['ApplicationChannel', 'util/Obj', 'util/Log', 'lib/jquery'],
    function (channel, obj) {
        var appSocket = null;
        var urlBase = window.document.location.pathname;

        channel.bind('server-command-callback-error', 'command-error', function (data) {
            console.error('Command error', data);
        });

        function getFormData(bean) {
            var formData = new FormData();
            obj.forEachKey(bean, function (key, value) {
                formData.append(key, value);
            });
            return formData;
        }

        function sendMultipart(bean) {
            var xhr = new window.XMLHttpRequest();
            xhr.open('POST', urlBase + 'cmd', true);
            xhr.onload = function (e) {
                var data = JSON.parse(this.response);

                // Commands callback calls
                channel.send('server-command-callback', bean.cmdName, data);

                if (data.success) {
                    channel.send('server-command-callback-success', bean.cmdName, data);
                } else {
                    channel.send('server-command-callback-error', bean.cmdName, data);
                    channel.send('server-command-callback-error', 'command-error', {
                        data: data,
                        bean: bean
                    });
                }
            };
            xhr.onerror = function (e) {
                var data = {
                    message: e,
                    bean: bean
                };
                channel.send('server-command-callback-error', bean.cmdName, data);
                channel.send('server-command-callback-error', 'command-error', data);
            };

            xhr.send(getFormData(bean));
        }

        function sendNormal(bean) {
            $.ajax({
                    url: urlBase + 'cmd',
                    type: 'POST',
                    data: bean,
                    dataType: 'text',
                    error: function (e) {
                        var data = {
                            message: e,
                            bean: bean
                        };
                        channel.send('server-command-callback-error', bean.cmdName, data);
                        channel.send('server-command-callback-error', 'command-error', data);
                    },
                    success: function (message) {
                        var data = JSON.parse(message);

                        // Commands callback calls
                        channel.send('server-command-callback', bean.cmdName, data);
                        if (data.success) {
                            channel.send('server-command-callback-success', bean.cmdName, data);
                        } else {
                            channel.send('server-command-callback-error', bean.cmdName, data);
                            channel.send('server-command-callback-error', 'command-error', {
                                data: data,
                                bean: bean
                            });
                        }
                    }
                }
            );
        }

        function sendMessage(bean) {
            var multipart = false;
            obj.forEachKey(bean, function (key, value) {
                // IE9 does not have File
                if (window.File) {
                    if (value instanceof window.File) {
                        multipart = true;
                        return false;
                    }
                }
            });
            if (multipart) {
                sendMultipart(bean);
                return;
            }

            sendNormal(bean);
        }

        return {
            sendMessage: sendMessage
        }
    }
);