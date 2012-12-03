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

import photodb.data.entity.Photo;
import photodb.data.execution.BaseEAO;
import photodb.data.execution.command.CreatePhoto;
import photodb.data.execution.command.FindUserByName;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.SessionContext;
import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class PhotoImpl {
    @EJB
    private BaseEAO baseEAO;

    @Resource
    private SessionContext ctx;

    public Photo createPhoto(String path, String fileName, String contentType, Integer x, Integer y) {
        final CreatePhoto create = new CreatePhoto();
        create.path = path;
        create.fileName = fileName;
        create.contentType = contentType;
        create.x = x;
        create.y = y;

        FindUserByName findUserByName = new FindUserByName();
        findUserByName.name = this.ctx.getCallerPrincipal().getName();
        create.user = this.baseEAO.execute(findUserByName);

        return this.baseEAO.execute(create);
    }

    public List<Photo> getPhotos() {
        // TODO no security yet. Just get all the photos
        return this.baseEAO.findAll(Photo.class);
    }

    public Photo getPhoto(Long uid) {
        // TODO no security yet. Just get the photo
        return this.baseEAO.find(Photo.class, uid);
    }

    public void updatePhotoPosition(Long uid, Integer x, Integer y) {
        // TODO no security yet. Just get the photo
        final Photo photo = this.baseEAO.find(Photo.class, uid);
        photo.setX(x);
        photo.setY(y);
    }
}
