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

import photodb.service.remote.Login;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import java.util.*;

@Stateless
public class LoginImpl implements Login {

    @EJB
    private UserImpl userImpl;

    // TODO: Add authentication logic here
    @Override
    public List<String> authenticate(String user, String password) {
        final Map<String, String> userPass = new HashMap<String, String>();
        final Map<String, List<String>> userGroups = new HashMap<String, List<String>>();

        userPass.put("paul", "michelle");
        userPass.put("eddie", "jump");
        userPass.put("michael", "bad");
        userPass.put("andreas", "roots");

        userGroups.put("paul", Arrays.asList("photo-admin", "photo-user"));
        userGroups.put("eddie", Arrays.asList("photo-user"));
        userGroups.put("michael", Arrays.asList("tomee-admin", "photo-admin", "photo-user"));
        userGroups.put("andreas", Collections.EMPTY_LIST);

        final String pass = userPass.get(user);
        if (password.equals(pass)) {
            if (this.userImpl.getUser(user) == null) {
                this.userImpl.createUser(user);
            }
            return userGroups.get(user);
        }

        throw new RuntimeException("Bad user or password!");
    }
}
