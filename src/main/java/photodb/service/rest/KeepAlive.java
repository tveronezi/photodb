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

import photodb.cdi.DtoBuilder;
import photodb.data.dto.SessionDataDto;
import photodb.data.dto.UserInfo;
import photodb.service.bean.UserImpl;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

@Path("/keep-alive")
@Produces("application/json")
public class KeepAlive {

    @Inject
    private DtoBuilder dtoBuilder;

    @Inject
    private UserImpl userService;

    @GET
    @Produces("application/json")
    @SuppressWarnings("PMD.EmptyCatchBlock")
    public SessionDataDto ping(@Context HttpServletRequest request) {
        final HttpSession session = request.getSession();
        final UserInfo info = this.dtoBuilder.build(this.userService.getUser());
        final String userName;
        final boolean logged;
        if (info == null) {
            userName = "guest";
            logged = false;
        } else {
            userName = info.getName();
            logged = true;
        }
        final SessionDataDto result = new SessionDataDto();
        result.setSessionId(session.getId());
        result.setUserName(userName);
        result.setLogged(logged);
        return result;
    }

}
