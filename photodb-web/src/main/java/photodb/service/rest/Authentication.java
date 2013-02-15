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
import photodb.service.bean.LoginImpl;

import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.List;

@Path("/authentication")
public class Authentication {
    @Inject
    private LoginImpl login;

    @POST
    @Produces("application/json")
    public AuthenticationDto authenticate(@FormParam("user") String user, @FormParam("password") String password) {
        final List<String> groups = login.authenticate(user, password);
        final AuthenticationDto result = new AuthenticationDto();
        result.setGroups(groups);
        return result;
    }

}
