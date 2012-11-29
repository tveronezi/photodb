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
import org.junit.Test
import photodb.service.ServiceFacade

import javax.ejb.EJBException
import javax.naming.Context
import javax.naming.InitialContext

class TestService {

    Context getContext() {
        Properties p = new Properties()
        p.put(Context.INITIAL_CONTEXT_FACTORY, "org.apache.openejb.core.LocalInitialContextFactory")
        return new InitialContext(p)
    }

    @Test
    void testCreatePhotoEntity() {
        Context context = getContext()
        ServiceFacade facade = context.lookup('java:global/classpath.ear/photodb-service/ServiceFacadeImpl')

        try {
            facade.createPhoto(null)
            Assert.fail()
        } catch (EJBException e) {
            // expected
        }

        def photoUid = facade.createPhoto('My path')
        Assert.assertNotNull(photoUid)

        try {
            facade.createComment(null, null)
            Assert.fail()
        } catch (EJBException e) {
            // expected
        }

        try {
            facade.createComment(photoUid, null)
            Assert.fail()
        } catch (EJBException e) {
            // expected
        }

        def commentUid = facade.createComment(photoUid, 'My comment')
        Assert.assertNotNull(commentUid)

        def comments = facade.getComments(photoUid)
        Assert.assertNotNull(comments)
        Assert.assertEquals(1, comments.size())
        comments.each {
            Assert.assertEquals(it.text, 'My comment')
        }
    }
}