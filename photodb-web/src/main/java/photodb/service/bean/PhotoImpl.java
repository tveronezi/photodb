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
import photodb.data.entity.User;
import photodb.data.execution.BaseEAO;
import photodb.data.execution.command.FindByStringField;
import photodb.data.execution.command.FindPhotoByUser;
import photodb.service.ApplicationException;

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

    private void setValues(Photo photo, String fileName, String content, String contentType, Boolean publicData) {
        photo.setFileName(fileName);
        photo.setContent(content);
        photo.setContentType(contentType);
        photo.setPublicData(publicData);
    }

    public Photo savePhoto(Long id, String fileName, String content, String contentType, Boolean publicData) {
        Photo photo;
        if (id == null) {
            photo = new Photo();
            setValues(photo, fileName, content, contentType, publicData);

            // Set photo owner
            final FindByStringField<User> findUserByName = new FindByStringField<User>(User.class, "name");
            findUserByName.value = this.ctx.getCallerPrincipal().getName();
            final User user = this.baseEAO.execute(findUserByName);
            photo.setUser(user);

            // Create the photo object
            photo = this.baseEAO.create(photo);
        } else {
            photo = this.baseEAO.find(Photo.class, id);

            // Once this transaction is done, these values will be persisted
            setValues(photo, fileName, content, contentType, publicData);
        }
        return photo;
    }

    public List<Photo> getPhotos() {
        FindByStringField<User> findUserByName = new FindByStringField<User>(User.class, "name");
        findUserByName.value = this.ctx.getCallerPrincipal().getName();

        FindPhotoByUser find = new FindPhotoByUser();
        find.user = this.baseEAO.execute(findUserByName);
        return this.baseEAO.execute(find);
    }

    public Photo getPhoto(Long uid) {
        // TODO No security yet. Just get the photo if that's yours.
        final Photo photo = this.baseEAO.find(Photo.class, uid);
        if (photo == null) {
            return null;
        }
        if (!photo.getUser().getName().equals(this.ctx.getCallerPrincipal().getName())) {
            throw new ApplicationException("No access to photo.");
        }
        return photo;
    }

    public void deletePhoto(Long uid) {
        final String userName = this.ctx.getCallerPrincipal().getName();
        final Photo photo = this.baseEAO.find(Photo.class, uid);
        if (photo == null) {
            return;
        }
        if (!photo.getUser().getName().equals(userName)) {
            return;
        }
        this.baseEAO.delete(photo);
    }
}
