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

define(['util/DelayedTask'], function (delayedTask) {
    describe('DelayedTask test', function () {
        // Saving the 'window.setTimeout' function
        var originalSetTimeout = window.setTimeout;
        var originalClearTimeout = window.clearTimeout;

        afterEach(function () {
            // Set the original setTimeout back
            window.setTimeout = originalSetTimeout;
            window.clearTimeout = originalClearTimeout;
        });

        it('should throw exception if we give no callback method', function () {
            var task = delayedTask.newObject();
            try {
                task.delay();
                expect(true).toBe(false);
            } catch (e) {
                expect('You should give me a callback method to execute').toEqual(e);
            }
        });

        it('should not use setTimeout if we give no timeout value', function () {
            // Mocking 'window.setTimeout'
            var executed = false;
            window.setTimeout = function () {
                executed = true;
            };

            var task = delayedTask.newObject();
            var calbackExecuted = false;
            task.delay(function () {
                calbackExecuted = true;
            });
            expect(executed).toBe(false);
            expect(calbackExecuted).toBe(true);
        });

        it('should use setTimeout if we give a timeout value', function () {
            // Mocking 'window.setTimeout'
            var setTimeoutExecuted = false;
            var callbackValue = null;
            var timeoutValue = null;
            window.setTimeout = function (callback, timeout) {
                setTimeoutExecuted = true;
                callbackValue = callback;
                timeoutValue = timeout;
                callback();
            };

            var task = delayedTask.newObject();
            var calbackExecuted = false;
            var myCallback = function () {
                calbackExecuted = true;
            };
            task.delay(myCallback, 1000);

            expect(setTimeoutExecuted).toBe(true);
            expect(calbackExecuted).toBe(true);
            expect(callbackValue).toEqual(myCallback);
            expect(timeoutValue).toEqual(1000);
        });

        it('should clear previous timeout execution', function () {
            var counterT = 0;
            var counterC = 0;

            // Mocking...
            window.setTimeout = function () {
                counterT++;
                return true;
            };
            window.clearTimeout = function () {
                counterC++;
                return true;
            };

            var noop = function () {
                // no-op
            };

            var task = delayedTask.newObject();
            task.delay(noop, 1000);
            task.delay(noop, 1000);
            task.delay(noop, 1000);

            expect(counterT - 1).toEqual(counterC);
        });
    });
});
