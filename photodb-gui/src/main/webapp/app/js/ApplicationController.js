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

/**
 * This is the application controller. This is the central point for logic and to forward actions to the views.
 * It contains all the views and model instances.
 */
"use strict";
define(['ApplicationChannel', 'ApplicationModel', 'view/ApplicationView'],
    function (channel, model, ApplicationView) {
        return function () {

            channel.bind('file-manager', 'new-local-file', function (data) {
                var bean = {
                    cmdName:'UploadPhoto',
                    x:data.x,
                    y:data.y,
                    localId:data.localId
                };
                bean[data.file.name] = data.file;
                model.sendMessage(bean);
            });

            channel.bind('ui-actions', 'container-rendered', function (data) {
                model.sendMessage({
                    cmdName:'GetPhotos'
                });
            });

            var view = ApplicationView();
            view.render();
        };
    }
);
