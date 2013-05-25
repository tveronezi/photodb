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

package photodb.service.rest;

import photodb.data.dto.AuthenticationDto;
import photodb.service.bean.UserImpl;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

@Path("/user")
@Produces("application/json")
public class User {

    @EJB
    private UserImpl userService;

    @POST
    @Path("/new")
    public void requestNewUser(@FormParam("j_username") String user, @FormParam("j_password") String password) {
        this.userService.requestUser(user, user, password);
    }

    @POST
    @Path("/authenticate")
    public void authenticate(@FormParam("j_username") String user, @FormParam("j_password") String password,
                             @Context HttpServletRequest request) throws ServletException {
        request.login(user, password);
        final AuthenticationDto authenticationDto = new AuthenticationDto();
        authenticationDto.setUser(user);
        authenticationDto.setPassword(password);

        final HttpSession session = request.getSession();
        session.setAttribute("authenticationDto", authenticationDto);
    }

    @POST
    @Path("/signout")
    public void signout(@Context HttpServletRequest request) {
        try {
            request.logout();
        } catch (ServletException e) {
            // no-op
        }
        final HttpSession session = request.getSession();
        session.removeAttribute("authenticationDto");
    }
}
