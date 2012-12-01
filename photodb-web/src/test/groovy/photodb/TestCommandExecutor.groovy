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
import photodb.web.command.CommandExecutor

import javax.servlet.ServletRequest
import javax.servlet.ServletResponse

class TestCommandExecutor {

    @Test
    void testSuccess() {
        //Mocking the ServiceFacade
        def serviceFacade = [createPhoto: {
            a, b, c, e, f -> 100l
        }] as ServiceFacade

        //In your browser, it would be
        //http://localhost:8080/photodb-web/cmd?cmdName=CreatePhoto&path=b
        def req = [getParameter: {
            key ->
            if (key == 'cmdName') {
                return 'CreatePhoto'
            }
            if (key == 'path') {
                return 'b'
            }
            return null
        }] as ServletRequest

        def resp = [] as ServletResponse

        //Creating an executor instance
        def executor = new CommandExecutor()
        def result = executor.execute(serviceFacade, req, resp)
        Assert.assertEquals(100l, result.output.photoUid)
    }

    @Test
    void testError() {
        def serviceFacade = [createPhoto: {
            path -> throw new RuntimeException('Expected exception!')
        }] as ServiceFacade
        def req = [getParameter: {
            key ->
            if (key == 'cmdName') {
                return 'CreatePhoto'
            }
            if (key == 'path') {
                return 'b'
            }
            return null
        }] as ServletRequest
        def resp = [] as ServletResponse

        def executor = new CommandExecutor()
        def result = executor.execute(serviceFacade, req, resp)
        Assert.assertEquals(false, result.success)
    }
}