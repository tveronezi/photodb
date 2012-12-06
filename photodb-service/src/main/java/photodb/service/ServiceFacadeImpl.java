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

package photodb.service;


import photodb.data.dto.PhotoDto;
import photodb.data.dto.UserDto;
import photodb.data.entity.Photo;
import photodb.data.entity.User;
import photodb.service.bean.DtoBuilderImpl;
import photodb.service.bean.PhotoImpl;
import photodb.service.bean.UserImpl;

import javax.ejb.EJB;
import javax.ejb.Remote;
import javax.ejb.Stateless;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * This is the access point to the service layer. We will never return a JPA bean from any of the methods defined here.
 * These methods manipulate the internal results and return DTOs to the client. We want to make the web layer as
 * detached as possible from the service layer.
 * <p/>
 * It contains injections to the dependencies the methods need to have in order to execute.
 * <p/>
 * All other EJBs are local (not accessible from the outside world).
 */
@Stateless
@Remote(ServiceFacade.class)
public class ServiceFacadeImpl implements ServiceFacade {
    @EJB
    private PhotoImpl photoService;

    @EJB
    private UserImpl userService;

    @EJB
    private DtoBuilderImpl dtoBuilder;

    @Override
    public UserDto getUser() {
        final User user = this.userService.getUser();
        return dtoBuilder.buildUser(user);
    }

    @Override
    public Long createPhoto(String path, String fileName, String contentType, Integer x, Integer y) {
        final Photo photo = this.photoService.createPhoto(path, fileName, contentType, x, y);
        return photo.getUid();
    }

    @Override
    public Set<PhotoDto> getAllPhotoDtos() {
        final List<Photo> photos = this.photoService.getPhotos();
        final Set<PhotoDto> result = new HashSet<PhotoDto>();
        for (Photo photo : photos) {
            result.add(this.dtoBuilder.buildPhoto(photo));
        }
        return result;

    }

    @Override
    public PhotoDto getPhoto(Long uid) {
        final Photo photo = this.photoService.getPhoto(uid);
        return this.dtoBuilder.buildPhoto(photo);
    }

    @Override
    public List<String> deletePhotos(List<Long> uids) {
        return this.photoService.deletePhotos(uids);
    }

    @Override
    public void updatePhotoPosition(Long uid, Integer x, Integer y) {
        this.photoService.updatePhotoPosition(uid, x, y);
    }
}
