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

define(['ApplicationModel', 'ApplicationChannel'], function (model, channel) {
    describe('ApplicationModel test', function () {

        var oXMLHttpRequest = window.XMLHttpRequest;
        var oFile = window.File;
        var oFormData = window.FormData;

        beforeEach(function () {
            channel.unbindAll();
        });

        afterEach(function () {
            // Setting original functions back
            window.XMLHttpRequest = oXMLHttpRequest;
            window.File = oFile;
            window.FormData = oFormData;
            channel.unbindAll();
        });

        it('should be able to send multipart requests', function () {
            var multipartCalled = false;
            var myParams = null;
            var XMLHttpRequestMock = function () {
            };
            XMLHttpRequestMock.prototype.open = function () {

            };
            XMLHttpRequestMock.prototype.onload = function () {

            };
            XMLHttpRequestMock.prototype.onerror = function () {

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
        });

    });
});
