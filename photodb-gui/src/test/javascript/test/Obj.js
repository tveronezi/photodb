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

define(['util/Obj', 'lib/jquery'], function (obj) {
    describe('Obj test', function () {
        it('should get test the getArray function', function () {
            expect(obj.getArray(null)).toEqual([]);

            var myObj = {};
            expect(obj.getArray(myObj)).toEqual([myObj]);

            var myArr = [
                {
                    a: 0
                }
            ];
            expect(obj.getArray(myArr)).toEqual(myArr);

            var tag = $('<input id="fileItem" type="file">');
            var fList = tag[0].files;
            expect(obj.getArray(fList)).toEqual(fList);
        });

        it('should get test the forEach function', function () {
            // Just don't break
            obj.forEach(null);

            var myValue = null;
            obj.forEach({
                value: 'a'
            }, function (bean) {
                myValue = bean.value;
            });
            expect(myValue).toEqual('a');

            var lastIndex = -1;
            obj.forEach(['a', 'b', 'c', 'd'], function (bean, index) {
                expect(++lastIndex).toEqual(index);
            });
            expect(lastIndex).toEqual(3);
        });

        it('should be able to bind a new scope to a method', function () {
            obj.bindScope({
                myNewScope: true
            }, function () {
                expect(this.myNewScope).toBe(true);
            });
        });

        it('should test the isEmpty method', function () {
            expect(obj.isEmpty()).toBe(true);
            expect(obj.isEmpty(null)).toBe(true);
            expect(obj.isEmpty(undefined)).toBe(true);
            expect(obj.isEmpty(1)).toBe(false);

            expect(obj.isEmpty([])).toBe(true);
            expect(obj.isEmpty([1])).toBe(false);

            expect(obj.isEmpty(null, undefined)).toBe(true);
            expect(obj.isEmpty(null, {})).toBe(true);
            expect(obj.isEmpty(1, undefined)).toBe(true);
            expect(obj.isEmpty(1, null)).toBe(true);
            expect(obj.isEmpty([1])).toBe(false);

        });
    });
});
