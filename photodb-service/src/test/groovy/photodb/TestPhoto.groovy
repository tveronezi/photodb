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

import javax.ejb.EJBException
import javax.ejb.embeddable.EJBContainer
import javax.naming.Context
import javax.naming.InitialContext
import javax.naming.NamingException

class TestPhoto {

    private Context getContext(String user, String pass) throws NamingException {
        def p = [
                (Context.INITIAL_CONTEXT_FACTORY): 'org.apache.openejb.core.LocalInitialContextFactory',
                ('openejb.authentication.realmName'): 'ScriptLogin',
                (Context.SECURITY_PRINCIPAL): user,
                (Context.SECURITY_CREDENTIALS): pass
        ] as Properties
        return new InitialContext(p)
    }

    @Before
    public void setUp() throws Exception {
        def ctxCl = Thread.currentThread().getContextClassLoader()
        System.setProperty('openejb.ScriptLoginModule.scriptURI', ctxCl.getResource('loginscript.js').toExternalForm())

        def p = [:] as Properties
        EJBContainer.createEJBContainer(p)
    }

    @Test
    void testCreatePhotoEntity() {
        def context = getContext('eddie', 'jump')

        try {
            def facade = context.lookup('java:global/photodb-service/ServiceFacadeImpl')
            try {
                facade.createPhoto(null, null, null, null, null)
                Assert.fail()
            } catch (EJBException e) {
                // expected
            }

            def photoUid = facade.createPhoto('path', 'name', 'mime', 0, 0)
            Assert.assertNotNull(photoUid)
        } finally {
            context.close()
        }
    }

    @Test
    void testGetPhotos() {
        def createPhoto = {
            user, pass, path ->
            def context = getContext(user, pass)
            def facade = context.lookup('java:global/photodb-service/ServiceFacadeImpl')
            facade.createPhoto(path, 'name', 'mime', 0, 0)
        }

        def getPhotos = {
            user, pass ->
            def context = getContext(user, pass)
            def facade = context.lookup('java:global/photodb-service/ServiceFacadeImpl')
            return facade.getAllPhotoDtos()
        }

        def dtos = null

        createPhoto('eddie', 'jump', 'path-a')
        createPhoto('eddie', 'jump', 'path-b')

        dtos = getPhotos('eddie', 'jump')
        Assert.assertNotNull(dtos)

        // "3" because this user has already a photo from the previous test
        Assert.assertEquals(dtos.size(), 3)

        createPhoto('michael', 'bad', 'path-c')

        dtos = getPhotos('michael', 'bad')
        Assert.assertNotNull(dtos)
        Assert.assertEquals(dtos.size(), 1)
    }

    @Test
    void testGetUser() {
        def context = getContext('eddie', 'jump')
        def facade = context.lookup('java:global/photodb-service/ServiceFacadeImpl')
        def dto = facade.getUser()
        Assert.assertNotNull(dto)
        Assert.assertFalse(dto.name == 'edie')
    }

}