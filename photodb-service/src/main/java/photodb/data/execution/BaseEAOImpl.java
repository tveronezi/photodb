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

package photodb.data.execution;

import photodb.data.entity.BaseEntity;

import javax.ejb.Local;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Stateless
@Local(BaseEAO.class)
public class BaseEAOImpl implements BaseEAO {
    @PersistenceContext(unitName = "photoPU")
    private EntityManager entityManager;

    @Override
    public <E> E execute(DbCommand<E> cmd) {
        return cmd.execute(this);
    }

    @Override
    public <E extends BaseEntity> E create(E entity) {
        this.entityManager.persist(entity);
        this.entityManager.flush();
        return entity;
    }

    @Override
    public <E extends BaseEntity> E find(Class<E> cls, Long uid) {
        return this.entityManager.find(cls, uid);
    }
}
