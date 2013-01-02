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

import photodb.data.entity.Group;
import photodb.data.entity.User;
import photodb.data.execution.BaseEAO;
import photodb.data.execution.command.CreateGroup;
import photodb.data.execution.command.CreateUser;
import photodb.data.execution.command.FindByStringField;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.SessionContext;
import javax.ejb.Stateless;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Stateless
public class UserImpl {
    @EJB
    private BaseEAO baseEAO;

    @EJB
    private LoginImpl login;

    @Resource
    private SessionContext ctx;

    public User createUser(String name, String password, List<String> groups) {
        final CreateUser createUser = new CreateUser();
        createUser.name = name;
        createUser.password = password;
        if (groups != null) {
            final FindByStringField<Group> findGroup = new FindByStringField<Group>(Group.class, "name");
            final Set<Group> usrGroups = new HashSet<Group>();
            for (String grpName : groups) {
                findGroup.value = grpName;
                final Group group = this.baseEAO.execute(findGroup);
                if (group != null) {
                    usrGroups.add(group);
                }
            }
            if (!usrGroups.isEmpty()) {
                createUser.groups = usrGroups;
            }
        }
        return this.baseEAO.execute(createUser);
    }

    public Group createGroup(String name) {
        final CreateGroup create = new CreateGroup();
        create.name = name;
        return this.baseEAO.execute(create);
    }


    public User getUser(String name) {
        final FindByStringField<User> find = new FindByStringField<User>(User.class, "name");
        find.value = name;
        return this.baseEAO.execute(find);
    }

    public Group getGroup(String name) {
        final FindByStringField<Group> find = new FindByStringField<Group>(Group.class, "name");
        find.value = name;
        return this.baseEAO.execute(find);
    }

    public User getUser() {
        return getUser(this.ctx.getCallerPrincipal().getName());
    }

    public void setPassword(String userName, String oldPassword, String newPassword) {
        login.authenticate(userName, oldPassword);
        User user = getUser(userName);
        user.setPassword(newPassword);
    }
}
