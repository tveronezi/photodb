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
import photodb.service.remote.Login;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class LoginImpl implements Login {

    @EJB
    private UserImpl userImpl;

    @Override
    public List<String> authenticate(String user, String password) {
        final User userBean = this.userImpl.getUser(user);
        if (userBean == null || !userBean.getPassword().equals(password)) {
            throw new RuntimeException("Bad user or password!");
        }

        final List<String> groups = new ArrayList<String>();
        for (Group group : userBean.getGroups()) {
            groups.add(group.getName());
        }
        return groups;
    }
}
