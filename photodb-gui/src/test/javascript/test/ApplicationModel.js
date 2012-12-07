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

define(['ApplicationModel', 'ApplicationChannel', 'lib/jquery'], function (model, channel) {
    describe('ApplicationModel test', function () {

        var oXMLHttpRequest = window.XMLHttpRequest;
        var oFile = window.File;
        var oFormData = window.FormData;
        var oAjaxCall = $.ajax;

        beforeEach(function () {
            channel.unbindAll();
        });

        afterEach(function () {
            // Setting original functions back
            window.XMLHttpRequest = oXMLHttpRequest;
            window.File = oFile;
            window.FormData = oFormData;
            $.ajax = oAjaxCall;
            channel.unbindAll();
        });

        it('should be able to send multipart requests', function () {
            var multipartCalled = false;
            var myParams = null;

            var errorCallback = null;
            var loadCallback = null;
            var XMLHttpRequestMock = function () {
            };
            XMLHttpRequestMock.prototype.open = function () {

            };
            XMLHttpRequestMock.prototype.addEventListener = function (on, callback) {
                if ('error' === on) {
                    errorCallback = callback;
                }

                if ('load' === on) {
                    loadCallback = callback;
                }
            };
            XMLHttpRequestMock.prototype.send = function (params) {
                myParams = params;
                multipartCalled = true;
            };
            window.XMLHttpRequest = XMLHttpRequestMock;

            window.File = function () {
            };

            var FormDataMock = function () {
            };
            var formDataValues = {};
            FormDataMock.prototype.append = function (key, value) {
                formDataValues[key] = value;
            };

            window.FormData = FormDataMock;

            var data = {
                cmdName: 'MyCommand',
                myFile: (new File())
            };
            model.sendMessage(data);

            expect(true).toBe(myParams instanceof window.FormData);
            expect(data).toEqual(formDataValues);

            expect(errorCallback).not.toBe(null);
            expect(loadCallback).not.toBe(null);

            channel.unbindAll();
            var executions = [];
            channel.bind('server-command-callback-success', 'MyCommand', function (ndata) {
                executions.push('MyCommand-success');
                expect(ndata).toEqual({
                    success: true
                });
            });
            channel.bind('server-command-callback-error', 'MyCommand', function (ndata) {
                executions.push('MyCommand-error');
            });
            channel.bind('server-command-callback-error', 'command-error', function (ndata) {
                executions.push('command-error');
                expect(data).toEqual(ndata.bean);
            });

            loadCallback({
                currentTarget: {
                    response: '{"success":true}'
                }
            });
            expect(executions).toEqual(['MyCommand-success']);

            loadCallback({
                currentTarget: {
                    response: '{}' // -> means error
                }
            });
            expect(executions).toEqual(['MyCommand-success', 'MyCommand-error', 'command-error']);

            errorCallback('my error!');
            expect(executions).toEqual([
                'MyCommand-success', 'MyCommand-error', 'command-error', 'MyCommand-error', 'command-error']);
        });


        it('should be able to send regular requests', function () {
            var myParams = null;
            $.ajax = function (params) {
                myParams = params;
            };
            var data = {
                cmdName: 'MyCommand'
            };
            model.sendMessage(data);

            expect(myParams).not.toBe(null);
            expect(myParams.data).toEqual(data);
            expect(myParams.dataType).toEqual('text');
            expect(myParams['type']).toEqual('POST');

            var execution = 0;
            var dataA = null;
            var dataB = null;
            channel.bind('server-command-callback-error', 'MyCommand', function (cdata) {
                ++execution;
                dataA = cdata;
            });
            channel.bind('server-command-callback-error', 'command-error', function (cdata) {
                ++execution;
                dataB = cdata;
            });

            myParams.error('my error!');
            expect(execution).toEqual(2);
            expect(dataA.message).toEqual('my error!');
            expect(dataA.bean).toEqual(data);

            expect(dataB.message).toEqual('my error!');
            expect(dataB.bean).toEqual(data);

            channel.unbindAll();
            execution = 0;
            dataA = null;
            dataB = null;
            channel.bind('server-command-callback-success', 'MyCommand', function (cdata) {
                ++execution;
                dataA = cdata;
            });
            channel.bind('server-command-callback-error', 'command-error', function (cdata) {
                ++execution;
                dataB = cdata;
            });

            var successData = '{"success": true}';
            myParams.success(successData);

            expect(dataA).toEqual(JSON.parse(successData));
            expect(dataB).toBe(null);
            expect(execution).toBe(1);

            execution = 0;
            dataA = null;
            dataB = null;
            successData = '{}';
            myParams.success(successData);

            expect(dataB).not.toBe(null);
            expect(dataB.data).toEqual(JSON.parse(successData));
            expect(dataA).toBe(null);
            expect(execution).toBe(1);
        });

    });
});
