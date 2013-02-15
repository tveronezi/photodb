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

package photodb.service;

import photodb.data.entity.Group;
import photodb.data.entity.User;
import photodb.service.bean.UserImpl;

import javax.annotation.PostConstruct;
import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import java.util.Arrays;
import java.util.List;

@Singleton
@Startup
public class ApplicationStart {
    @EJB
    private UserImpl userService;

    @PostConstruct
    public void applicationStartup() {
        final List<String> groups = Arrays.asList("tomee-admin", "photo-admin", "photo-user");
        for (String grpName : groups) {
            createGroup(grpName);
        }
        createUser("michael", "bad", groups);
        createUser("eddie", "jump", Arrays.asList("photodb-user"));
        createUser("paul", "michelle", Arrays.asList("photo-admin", "photodb-user"));
        createUser("andreas", "roots", null);
    }

    private void createUser(String name, String pass, List<String> groups) {
        User usr = userService.getUser(name);
        if (usr != null) {
            return;
        }
        this.userService.createUser(name, pass, groups);
    }

    private void createGroup(String name) {
        Group grp = this.userService.getGroup(name);
        if (grp != null) {
            return;
        }
        this.userService.createGroup(name);
    }
}
