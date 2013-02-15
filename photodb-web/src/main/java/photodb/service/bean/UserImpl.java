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

package photodb.service.bean;

import photodb.data.entity.User;
import photodb.data.execution.BaseEAO;
import photodb.data.execution.command.CreateUser;
import photodb.data.execution.command.FindByStringField;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.SessionContext;
import javax.ejb.Stateless;

@Stateless
public class UserImpl {
    @EJB
    private BaseEAO baseEAO;

    @Resource
    private SessionContext ctx;

    public User createUser(String name) {
        final CreateUser createUser = new CreateUser();
        createUser.name = name;
        return this.baseEAO.execute(createUser);
    }

    public User getUser(String name) {
        final FindByStringField<User> find = new FindByStringField<User>(User.class, "name");
        find.value = name;
        return this.baseEAO.execute(find);
    }

    public User getUser() {
        final String userName = this.ctx.getCallerPrincipal().getName();
        User user = getUser(userName);
        if (user == null) {
            user = createUser(userName);
        }
        return user;
    }

}
