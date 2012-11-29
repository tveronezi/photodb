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

package photodb.web.command

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import photodb.service.ServiceFacade

class CommandExecutor {
    private static final String PATH = "photodb.web.command.impl."

    def gson = new Gson()
    def mapType = new TypeToken<Map<String, Object>>() {
    }.getType()

    def execute(ServiceFacade serviceFacade, String rawParams) {
        def result = [:]

        long start = System.currentTimeMillis()
        result.put("start", start)

        try {
            def params = gson.fromJson(rawParams, mapType)
            result.put("params", params)

            // Remove the cmdName from this list.
            String cmdName = (String) params.remove("cmdName")
            Class<?> cls = Class.forName(PATH + cmdName)

            def cmd = cls.newInstance()

            result << ['cmdName': cmdName]
            result << ['output': cmd.execute(serviceFacade, params)]
            result << ['success': Boolean.TRUE]

        } catch (Throwable e) {
            result << ['success': Boolean.FALSE]

            Writer writer = new StringWriter()
            PrintWriter printWriter = new PrintWriter(writer)
            e.printStackTrace(printWriter)

            result << ['output': writer.toString()]
        }

        result << ['timeSpent': System.currentTimeMillis() - start]
        return result
    }
}
