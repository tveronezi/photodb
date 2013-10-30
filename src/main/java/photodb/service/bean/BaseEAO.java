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

import photodb.data.entity.BaseEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;

@Stateless(name = "photodb-BaseEAOImpl")
public class BaseEAO {

    @PersistenceContext(unitName = "photoPU")
    private EntityManager em;

    public <E extends BaseEntity> E create(E entity) {
        this.em.persist(entity);
        this.em.flush();
        return entity;
    }

    public <E extends BaseEntity> void delete(E entity) {
        this.em.remove(entity);
    }

    public <E extends BaseEntity> E find(Class<E> cls, Long uid) {
        return this.em.find(cls, uid);
    }

    private <E extends BaseEntity> Query createFindQuery(Class<E> cls, String fieldName, Object fieldValue) {
        final String queryText = "SELECT e FROM " + cls.getName() + " e WHERE e." + fieldName + " = :pParam";
        final Query query = this.em.createQuery(queryText);
        query.setParameter("pParam", fieldValue);
        return query;
    }

    public <E extends BaseEntity> E find(Class<E> cls, String fieldName, Object fieldValue) {
        final Query query = createFindQuery(cls, fieldName, fieldValue);
        E result;
        try {
            result = cls.cast(query.getSingleResult());
        } catch (NoResultException e) {
            result = null;
        }
        return result;
    }

    public <E extends BaseEntity> List<E> findAll(Class<E> cls, String fieldName, Object fieldValue) {
        final Query query = createFindQuery(cls, fieldName, fieldValue);
        return (List<E>) query.getResultList();
    }

}
