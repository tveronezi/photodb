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

define(['ApplicationTemplates', 'lib/jquery'], function (templates) {
    describe('ApplicationTemplates test', function () {

        it('should show throw exception', function () {
            try {
                templates.getValue('UNKNOWN-TEMPLATE');
                expect(false).toBe(true);
            } catch (e) {
                expect(e).toEqual('Template not registered. "UNKNOWN-TEMPLATE"');
            }

        });

        it('should get simple template', function () {
            var el = $(templates.getValue('application-growl'));
            expect(el.hasClass('growl-container')).toBe(true);
        });

        it('should get template with parameters', function () {
            var el = $(templates.getValue('application', {
                id: 'myId'
            }));
            expect(el.attr('id')).toEqual('myId');
        });
    });
});
