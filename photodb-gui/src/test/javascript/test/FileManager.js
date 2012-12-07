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

            // Mocking successful requests
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[0]);
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[1]);

            expect(counter).toEqual(2);
        });

        it('should listen for "file-selection" requests', function () {
            var executed = false;
            var photos = null;

            // Creating the photos
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[0]);
            channel.send('server-command-callback-success', 'DownloadPhoto', reqs[1]);

            function testMe(myUid, expectSelected) {
                executed = false;
                photos = null;
                channel.send('ui-actions', 'file-selection', {
                    photoUid: myUid
                });

                expect(executed).toBe(true);
                expect(photos.length).toBe(2);
                expect(photos[1].photoId).toBe(myUid); // the last guy on this list

                // "!!" translates undefined and null to false
                expect(!!photos[1].isSelected).toBe(expectSelected);
                expect(!!photos[0].isSelected).toBe(false);
            }

            channel.bind('file-manager', 'files-updated', function (data) {
                photos = data;
                executed = true;
            });

            testMe('myUid-A', true);
            testMe('myUid-A', false);
            testMe('myUid-B', true);
            testMe('myUid-B', false);

            executed = false;
            photos = null;
            channel.send('ui-actions', 'file-selection', {
                photoUid: 'UNKNOWN-UID'
            });
            expect(executed).toBe(false);
            expect(photos).toBe(null);
        });

        it('placeholder', function () {
            expect(true).toBe(true);
        });

        it('placeholder', function () {
            expect(true).toBe(true);
        });

        it('placeholder', function () {
            expect(true).toBe(true);
        });

        it('placeholder', function () {
            expect(true).toBe(true);
        });

        it('placeholder', function () {
            expect(true).toBe(true);
        });

        it('placeholder', function () {
            expect(true).toBe(true);
        });

        it('placeholder', function () {
            expect(true).toBe(true);
        });
    });
});
