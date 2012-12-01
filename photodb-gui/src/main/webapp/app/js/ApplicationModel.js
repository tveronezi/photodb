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
define(['ApplicationChannel', 'util/Obj', 'lib/jquery'],
    function (channel, obj) {
        var appSocket = null;
        var urlBase = window.document.URL;

        urlBase = urlBase.replace(new RegExp('^' + window.location.protocol + '//'), '');
        urlBase = urlBase.replace(new RegExp('^' + window.document.location.host), '');
        urlBase = urlBase.replace('#', '');

        function sendMultipart(bean) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', urlBase + 'cmd', true);
            xhr.onload = function (e) {
                var data = JSON.parse(this.response);
                if (data.cmdName) {
                    // Commands callback calls
                    channel.send('server-command-callback', data.cmdName, data);

                    if (data.success) {
                        channel.send('server-command-callback-success', data.cmdName, data);
                    } else {
                        channel.send('server-command-callback-error', data.cmdName, data);
                    }

                } else {
                    channel.send('server-callback', 'socket-message-received', {
                        data:data
                    });
                }
            };
            xhr.onerror = function (e) {
                channel.send('server-connection', 'socket-connection-error', {
                    message:data
                });
            };

            var formData = new FormData();
            obj.forEachKey(bean, function (key, value) {
                formData.append(key, value);
            });

            xhr.send(formData);
        }

        function sendNormal(bean) {
            $.ajax({
                    url:urlBase + 'cmd',
                    type:'POST',
                    data:bean,
                    error:function (data) {
                        channel.send('server-connection', 'socket-connection-error', {
                            message:data
                        });
                    },
                    success:function (message) {
                        var data = JSON.parse(message);
                        if (data.cmdName) {
                            // Commands callback calls
                            channel.send('server-command-callback', data.cmdName, data);

                            if (data.success) {
                                channel.send('server-command-callback-success', data.cmdName, data);
                            } else {
                                channel.send('server-command-callback-error', data.cmdName, data);
                            }

                        } else {
                            channel.send('server-callback', 'socket-message-received', {
                                data:data
                            });
                        }
                    }
                }
            );
        }

        function sendMessage(bean) {
            var multipart = false;
            obj.forEachKey(bean, function (key, value) {
                if (value instanceof File) {
                    multipart = true;
                    return false;
                }
            });
            if (multipart) {
                sendMultipart(bean);
            } else {
                sendNormal(bean);
            }
        }

        return {
            sendMessage:sendMessage
        }
    }
);