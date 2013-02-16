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

import photodb.data.entity.User;
import photodb.data.entity.Photo;
import photodb.data.execution.BaseEAO;
import photodb.data.execution.DbCommand;

public class CreatePhoto implements DbCommand<Photo> {

    public User user;
    public String path;
    public String fileName;
    public String contentType;

    @Override
    public Photo execute(BaseEAO eao) {
        Photo photo = new Photo();
        photo.setPath(this.path);
        photo.setFileName(this.fileName);
        photo.setContentType(this.contentType);
        photo.setUser(this.user);
        photo.setPublicData(Boolean.FALSE);
        photo = eao.create(photo);
        return photo;
    }
}
