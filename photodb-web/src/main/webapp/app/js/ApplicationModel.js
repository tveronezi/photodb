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
define(['ApplicationChannel', 'lib/jquery'],
    function (channel) {
        var appSocket = null;
        var urlBase = window.document.URL;

        urlBase = urlBase.replace(new RegExp('^' + window.location.protocol + '//'), '');
        urlBase = urlBase.replace(new RegExp('^' + window.document.location.host), '');
        urlBase = urlBase.replace('#', '');

        function sendMessage(bean) {
            var str = JSON.stringify(bean);
            $.ajax({
                    url:urlBase + 'command',
                    type:'POST',
                    dataType:'text',
                    data:{
                        strParam:str
                    },
                    error:function (data) {
                        channel.send('server-connection', 'socket-connection-error', {
                            message:data
                        });
                    },
                    success:function (data) {
                        var data = JSON.parse(message.data);
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

        function uploadFile(file, x, y, localId) {
            var formData = new FormData();
            formData.append(file.name, file);
            formData.append('x', x);
            formData.append('y', y);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', urlBase + 'upload', true);
            xhr.onload = function (e) {
                var result = JSON.parse(this.response);
                result.localId = localId;
                channel.send('server-command-callback-success', 'upload-file', result);
            };
            xhr.onerror = function (e) {
                channel.send('server-command-callback-error', 'upload-file', {
                    event:e
                });
            };
            xhr.send(formData);
        }

        return {
            sendMessage:sendMessage,
            uploadFile:uploadFile
        }
    }
);