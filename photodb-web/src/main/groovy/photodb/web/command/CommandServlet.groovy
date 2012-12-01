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
import photodb.service.ServiceFacade

import javax.ejb.EJB
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@WebServlet(name = "command servlet", urlPatterns = '/cmd')
class CommandServlet extends HttpServlet {

    @EJB
    ServiceFacade serviceFacade


    def executor = new CommandExecutor()

    /**
     * This method is mostly used for testing purposes. It allows the user to call the "cmd" servlet from the
     * browsers address bar with a simple get. For example: you could call...
     * http://localhost:8080/photodb-web/cmd?strParam={cmdName:'CreatePhoto',path:'my path'}
     * @param req
     * @param resp
     */
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        execute(req, resp)
    }

    /**
     * This method is going to be used by the Javascript code at the client side.
     * @param req
     * @param resp
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        execute(req, resp)
    }

    private void execute(final HttpServletRequest req, final HttpServletResponse resp) {
        def result = executor.execute(serviceFacade, req.getParameter("strParam"))
        def gson = new GsonBuilder().setPrettyPrinting().create()
        resp.getWriter().write(gson.toJson(result))
    }
}
