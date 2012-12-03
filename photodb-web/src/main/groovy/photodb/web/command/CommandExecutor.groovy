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

import photodb.service.ServiceFacade

import javax.servlet.ServletRequest
import javax.servlet.ServletResponse
import org.apache.commons.fileupload.FileItemFactory
import org.apache.commons.fileupload.disk.DiskFileItemFactory
import org.apache.commons.fileupload.servlet.ServletFileUpload

class CommandExecutor {
    private static final String PATH = "photodb.web.command.impl."

    def execute(ServiceFacade serviceFacade, ServletRequest req, ServletResponse resp) {
        def result = [:]
        result << ['success': Boolean.FALSE]

        long start = System.currentTimeMillis()
        result.put("start", start)

        try {
            String cmdName = req.getParameter("cmdName")
            def data = [:]
            if(cmdName) {
                def names = req.getParameterNames()
                names.each { name ->
                    data[name] = req.getParameter(name)
                }

            } else {
                // Create a new file upload handler
                ServletFileUpload parser = new ServletFileUpload(new DiskFileItemFactory())
                // Parse the request
                List items = parser.parseRequest(req)

                items.each { item ->
                    if (item.isFormField()) {
                        data[item.getFieldName()] = item.getString()
                    } else {
                        data['fileItem'] = item
                    }
                }

                cmdName = data.cmdName
            }
            req.setAttribute('params', data)

            Class<?> cls = Class.forName(PATH + cmdName)

            def cmd = cls.newInstance()
            def output = cmd.execute(serviceFacade, req, resp)

            // If the command returns the resp object, if means
            // the command manages what it wants to return
            if (output == resp) {
                return output
            } else {
                // Otherwise we return a JSON object
                result << ['cmdName': cmdName]
                result << ['output': output]
                result << ['params': data]
                result << ['success': Boolean.TRUE]
            }

        } catch (Throwable e) {
            Writer writer = new StringWriter()
            PrintWriter printWriter = new PrintWriter(writer)
            e.printStackTrace(printWriter)

            result << ['output': writer.toString()]
        }

        result << ['timeSpent': System.currentTimeMillis() - start]
        return result
    }
}
