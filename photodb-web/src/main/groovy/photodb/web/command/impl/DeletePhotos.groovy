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

package photodb.web.command.impl

import photodb.service.ServiceFacade
import photodb.web.command.Command

import javax.servlet.ServletRequest
import javax.servlet.ServletResponse

class DeletePhotos implements Command {

    @Override
    def execute(ServiceFacade serviceFacade, ServletRequest req, ServletResponse resp) {
        List uids = req.getParameter('uids').split(',').collect {
            it as Long
        }

        List paths = serviceFacade.deletePhotos(uids)
        File dir = UploadPhoto.getImagesDir(req)
        paths.each { path ->
            File file = new File(dir, path)
            if (file.exists()) {
                file.delete()
            }
        }

        return null;
    }
}
