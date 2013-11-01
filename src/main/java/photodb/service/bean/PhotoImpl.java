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
import photodb.service.ApplicationException;

import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import java.util.List;

@Stateless
public class PhotoImpl {
    @Inject
    private BaseEAO baseEAO;

    @Inject
    private UserImpl user;

    private void setValues(Photo photo, String fileName, String content, String contentType, Boolean publicData) {
        photo.setFileName(fileName);
        photo.setContent(content);
        photo.setContentType(contentType);
        photo.setPublicData(publicData);
    }

    @RolesAllowed({"photo-user"})
    public Photo savePhoto(Long id, String fileName, String content, String contentType, Boolean publicData) {
        Photo photo;
        if (id == null) {
            photo = new Photo();
            setValues(photo, fileName, content, contentType, publicData);

            // Set photo owner
            photo.setUser(this.user.getUser());

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
        final User owner = this.user.getUser();
        return this.baseEAO.findAll(Photo.class, "user", owner);
    }

    public Photo getPhoto(Long uid) {
        final Photo photo = this.baseEAO.find(Photo.class, uid);
        if (photo == null) {
            return null;
        }
        if (!photo.getUser().equals(this.user.getUser())) {
            throw new ApplicationException("No access to photo.");
        }
        return photo;
    }

    @RolesAllowed({"photo-user"})
    public void deletePhoto(Long uid) {
        final Photo photo = this.baseEAO.find(Photo.class, uid);
        if (photo == null) {
            return;
        }
        if (!photo.getUser().equals(this.user.getUser())) {
            return;
        }
        this.baseEAO.delete(photo);
    }
}
