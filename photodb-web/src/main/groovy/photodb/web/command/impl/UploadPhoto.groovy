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

class UploadPhoto implements Command {

    public static File getImagesDir(ServletRequest req) {
        // TODO: For now we are going to use this directory
        // We will use something else later.
        File imagesDir = new File(req.servletContext.getRealPath('/WEB-INF/images'))
        imagesDir.mkdirs()
        return imagesDir
    }

    @Override
    def execute(ServiceFacade serviceFacade, ServletRequest req, ServletResponse resp) {
        File imagesDir = getImagesDir(req)
        def sessionId = req.session.id
        def data = req.getAttribute('params')
        String path = sessionId + '-' + System.currentTimeMillis()
        File uploadedFile = new File(imagesDir, path)
        data.fileItem.write(uploadedFile)
        def photoId = serviceFacade.createPhoto(
                path,
                data.fileItem.fileName as String,
                data.fileItem.contentType as String
        )
        return [
                photoId: photoId
        ]
    }
}
