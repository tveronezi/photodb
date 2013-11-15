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

package photodb.cdi;

import photodb.data.dto.PhotoDto;
import photodb.data.dto.UserInfo;
import photodb.data.entity.Photo;
import photodb.data.entity.User;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@ApplicationScoped
public class DtoBuilder {

    @Inject
    private ImageManager imageManager;

    public PhotoDto build(Photo photo) {
        if (photo == null) {
            return null;
        }
        final PhotoDto dto = new PhotoDto();
        dto.setId(photo.getUid());
        dto.setName(photo.getFileName());
        dto.setContent(photo.getContent());
        dto.setContentType(photo.getContentType());
        dto.setPublicData(photo.getPublicData());
        return dto;
    }

    public List<PhotoDto> build(Collection<Photo> photos) throws IOException {
        final List<PhotoDto> result = new ArrayList<PhotoDto>();
        if (photos != null) {
            for (Photo photo : photos) {
                PhotoDto dto = build(photo);
                dto.setContent(this.imageManager.getThumb(dto.getContent()));
                result.add(dto);
            }
        }
        return result;
    }

    public UserInfo build(User user) {
        if (user == null) {
            return null;
        }

        final UserInfo result = new UserInfo();
        result.setName(user.getName());
        return result;
    }

}
