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
import photodb.web.command.CommandExecutor
import photodb.web.command.CommandServlet

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class TestCommandServlet {

    @Test
    void testCall() {
        //Mocking the ServiceFacade
        def executor = [
                execute: {
                    facade, req, resp -> return 'command executed'
                }
        ] as CommandExecutor

        def result = new StringWriter()
        def req = [
                getParameter: {
                    str -> 'parameter a'
                }
        ] as HttpServletRequest
        def resp = [
                getWriter: {
                    ->
                    return new PrintWriter(result)
                }
        ] as HttpServletResponse

        //Creating an executor instance
        def servlet = new CommandServlet(
                executor: executor
        )
        servlet.execute(req, resp)
        Assert.assertEquals('"command executed"', result.toString())
    }
}