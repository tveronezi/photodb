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

package photodb.data.execution.command;

import photodb.data.entity.Group;
import photodb.data.entity.User;
import photodb.data.execution.BaseEAO;
import photodb.data.execution.DbCommand;

import java.util.Set;

public class CreateUser implements DbCommand<User> {

    public String name;
    public String password;
    public Set<Group> groups;

    @Override
    public User execute(BaseEAO eao) {
        User user = new User();
        user.setName(this.name);

        if (this.password == null) {
            user.setPassword("");
        } else {
            user.setPassword(this.password);
        }

        user.setGroups(this.groups);
        user = eao.create(user);
        return user;
    }
}
