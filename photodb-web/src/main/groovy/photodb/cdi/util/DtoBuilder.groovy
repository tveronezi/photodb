/**
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License") you may not use this file except in compliance with
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

package photodb.cdi.util

import photodb.data.dto.PhotoDto
import photodb.data.entity.Photo

import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject

@ApplicationScoped
class DtoBuilder {

    @Inject
    ImageManager imageManager

    PhotoDto build(Photo photo) {
        if (photo == null) {
            return null
        }
        final PhotoDto result = new PhotoDto()
        result.setId(photo.getUid())
        result.setName(photo.getFileName())
        result.setContent(photo.getContent())
        result.setContentType(photo.getContentType())
        result.setPublicData(photo.getPublicData())
        return result
    }

    List<PhotoDto> build(Collection<Photo> photos) {
        List<PhotoDto> result = new ArrayList<PhotoDto>()
        if (photos != null) {
            for (Photo photo : photos) {
                final PhotoDto dto = build((photo))
                final String thumb = imageManager.getThumb(dto.getContent())
                dto.setContent(thumb)
                result.add(dto)
            }
        }
        return result
    }
}
