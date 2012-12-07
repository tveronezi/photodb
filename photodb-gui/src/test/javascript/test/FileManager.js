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

define(['FileManager', 'ApplicationChannel'], function (FileManager, channel) {

    describe('FileManager test', function () {
        // Saving the 'window.setTimeout' function
        var originalSetTimeout = window.setTimeout;
        var originalClearTimeout = window.clearTimeout;

        beforeEach(function () {
            channel.unbindAll();
            FileManager.newObject();
        });

        afterEach(function () {
            channel.unbindAll();

            // Set the original setTimeout back
            window.setTimeout = originalSetTimeout;
            window.clearTimeout = originalClearTimeout;
        });

        it('should listen for successful "DownloadPhoto" requests', function () {
            // Mocking the setTimeout function
            window.setTimeout = function (callback) {
                callback();
            };

            var counter = 0;

            var uids = [
                ['myUid-A'],
                ['myUid-A', 'myUid-B']
            ];
            channel.bind('file-manager', 'files-updated', function (data) {
                counter++;

                expect(data).not.toBe(null);
                expect(data.uids).not.toBe(uids.pop());
            });

            var reqs = [
                {
                    params: {
                        x: 1,
                        y: 2,
                        uid: 'myUid-A'
                    },
                    output: {
                        content: 'laia laia laia 1'
                    }
                },
                {
                    params: {
                        x: 3,
                        y: 4,
                        uid: 'myUid-B'
                    },
                    output: {
                        content: 'laia laia laia 2'
                    }
                }
            ];

            // Mocking successful requests
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[0]);
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[1]);

            expect(counter).toEqual(2);
        });

    });
});
