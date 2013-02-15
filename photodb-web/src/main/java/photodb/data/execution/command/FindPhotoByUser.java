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

import photodb.data.entity.Photo;
import photodb.data.entity.User;
import photodb.data.execution.BaseEAO;
import photodb.data.execution.DbCommand;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.List;

public class FindPhotoByUser implements DbCommand<List<Photo>> {

    public User user;

    @Override
    public List<Photo> execute(BaseEAO eao) {
        // TODO No security yet. Just get the photo if that's yours or public.
        final CriteriaBuilder cb = eao.getCriteriaBuilder();
        final CriteriaQuery<Photo> cq = cb.createQuery(Photo.class);
        final Root<Photo> root = cq.from(Photo.class);
        cq.select(root);

        final Path<User> pathUser = root.get("user");
        final Path<Boolean> pathPublicData = root.get("publicData");
        final Predicate or = cb.or(cb.equal(pathUser, this.user), cb.isTrue(pathPublicData));
        cq.where(or);

        final TypedQuery<Photo> q = eao.createQuery(cq);
        return q.getResultList();
    }
}
