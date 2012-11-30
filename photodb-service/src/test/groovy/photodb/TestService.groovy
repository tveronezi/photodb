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

package photodb

import junit.framework.Assert
import org.junit.Before
import org.junit.Test
import photodb.service.ServiceFacade

import javax.ejb.EJB
import javax.ejb.EJBException
import javax.ejb.embeddable.EJBContainer

class TestService {

    private EJBContainer container;

    @EJB
    private ServiceFacade facade;

    @Before
    public void startContainer() throws Exception {
        container = EJBContainer.createEJBContainer();
        container.getContext().bind("inject", this);
    }

    @Test
    void testCreatePhotoEntity() {
        try {
            this.facade.createPhoto(null, null, null, null, null)
            Assert.fail()
        } catch (EJBException e) {
            // expected
        }

        def photoUid = this.facade.createPhoto('path', 'name', 'mime', 0, 0)
        Assert.assertNotNull(photoUid)
    }

    @Test
    void testGetPhotos() {
        def dtos = this.facade.getAllPhotoDtos()
        Assert.assertNotNull(dtos)
        Assert.assertFalse(dtos.empty)
    }

}