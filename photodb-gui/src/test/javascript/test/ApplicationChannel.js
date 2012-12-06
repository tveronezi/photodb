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

define(['ApplicationChannel'], function (channel) {
    describe('ApplicationChannel test', function () {
        var executionCounter = 0;

        it('should execute both listeners', function () {
            var result = [];
            channel.bind('channel-a', 'type-1', function (data) {
                ++executionCounter;
                result.push(data.value + '-1');
            });
            channel.bind('channel-a', 'type-1', function (data) {
                ++executionCounter;
                result.push(data.value + '-2');
            });
            channel.send('channel-a', 'type-1', {
                value: 'a'
            });
            expect(result.join(',')).toEqual('a-1,a-2');
            expect(executionCounter).toEqual(2);
        });

        it('should execute only one listener', function () {
            var result = [];
            channel.bind('channel-b', 'type-1', function (data) {
                result.push(data.value + '-1');
            });
            channel.bind('channel-b', 'type-2', function (data) {
                result.push(data.value + '-2');
            });
            channel.send('channel-b', 'type-1', {
                value: 'a'
            });
            expect(result.join(',')).toEqual('a-1');
        });

        it('should throw exception', function () {
            channel.bind('channel-c', 'type-1', function (data) {
                throw 'my exception';
            });
            try {
                channel.send('channel-c', 'type-1', {
                    value: 'a'
                });
            } catch (e) {
                expect(e).toEqual('my exception');
            }
        });

        it('should unbind', function () {
            var result = [];
            channel.bind('channel-d', 'type-1', function (data) {
                result.push(data.value);
            });
            channel.send('channel-d', 'type-1', {
                value: 'a'
            });
            expect(result.join('')).toEqual('a');
            channel.unbind('channel-d', 'type-1');
            channel.send('channel-d', 'type-1', {
                value: 'a'
            });
            expect(result.join('')).toEqual('a');
        });


        it('should unbind all the listeners', function () {
            expect(executionCounter).toEqual(2);

            var result = [];
            channel.bind('channel-e', 'type-1', function (data) {
                ++executionCounter;
                result.push(data.value);
            });
            channel.bind('channel-f', 'type-1', function (data) {
                ++executionCounter;
                result.push(data.value);
            });

            channel.send('channel-e', 'type-1', {
                value: 'a'
            });
            expect(executionCounter).toEqual(3);
            expect(result.join('')).toEqual('a');

            channel.send('channel-f', 'type-1', {
                value: 'b'
            });
            expect(executionCounter).toEqual(4);
            expect(result.join('')).toEqual('ab');

            // Unbind channel-e
            channel.unbindAll('channel-e');
            channel.send('channel-e', 'type-1', {
                value: 'a'
            });
            expect(executionCounter).toEqual(4);
            expect(result.join('')).toEqual('ab');

            channel.send('channel-f', 'type-1', {
                value: 'b'
            });
            expect(executionCounter).toEqual(5);
            expect(result.join('')).toEqual('abb');

            // Send a message through the channel created in the first test
            channel.send('channel-a', 'type-1', {
                value: 'a'
            });
            // 'channel-a' -> 'type-1' has two listeners
            expect(executionCounter).toEqual(7);
            expect(result.join('')).toEqual('abb');

            // Zapping all the listeners
            channel.unbindAll();
            channel.send('channel-a', 'type-1', {
                value: 'a'
            });
            channel.send('channel-f', 'type-1', {
                value: 'b'
            });
            channel.send('channel-e', 'type-1', {
                value: 'a'
            });
            expect(executionCounter).toEqual(7);
            expect(result.join('')).toEqual('abb');
        });
    });
});
