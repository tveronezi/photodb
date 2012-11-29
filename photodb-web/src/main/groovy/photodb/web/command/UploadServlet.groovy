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

package photodb.web.command

import com.google.gson.GsonBuilder
import org.apache.commons.fileupload.FileItemFactory
import org.apache.commons.fileupload.disk.DiskFileItemFactory
import org.apache.commons.fileupload.servlet.ServletFileUpload
import photodb.service.ServiceFacade

import javax.ejb.EJB
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@WebServlet(urlPatterns = ['/upload'])
class UploadServlet extends HttpServlet {
    @EJB
    ServiceFacade serviceFacade

    /**
     * This method is going to be used by the Javascript code at the client side.
     * @param req
     * @param resp
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        // Create a factory for disk-based file items
        FileItemFactory factory = new DiskFileItemFactory();

        // Create a new file upload handler
        ServletFileUpload upload = new ServletFileUpload(factory);

        // TODO: For now we are going to use this directory
        // We will use something else later.
        File imagesDir = new File(req.getRealPath('/WEB-INF/images'))
        imagesDir.mkdirs()

        def sessionId = req.session.id

        // Parse the request
        List items = upload.parseRequest(req);
        def data = [:]
        items.each { item ->
            if (item.isFormField()) {
                data[item.getFieldName()] = item.getString()
            } else {
                data['fileItem'] = item
            }
        }
        String path = sessionId + '-' + System.currentTimeMillis()
        File uploadedFile = new File(imagesDir, path);
        data.fileItem.write(uploadedFile);
        def photoId = serviceFacade.createPhoto(
                path,
                data.fileItem.fileName,
                data.fileItem.contentType,
                Integer.valueOf(data.x),
                Integer.valueOf(data.y)
        )
        def result = [
                photoId: photoId
        ]
        def gson = new GsonBuilder().setPrettyPrinting().create()
        resp.getWriter().write(gson.toJson(result))
    }
}
