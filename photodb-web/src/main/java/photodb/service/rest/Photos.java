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

package photodb.service.rest;

import photodb.data.dto.PhotoDto;
import photodb.data.entity.Photo;
import photodb.service.bean.DtoBuilderImpl;
import photodb.service.bean.PhotoImpl;

import javax.ejb.EJB;
import javax.ws.rs.*;
import java.util.List;

@Path("/photos")
public class Photos {

    @EJB
    private PhotoImpl photoService;

    @EJB
    private DtoBuilderImpl dtoBuilder;

    @GET
    @Path("/{id}")
    @Produces("application/json")
    public PhotoDto get(@PathParam("id") Long id) {
        final Photo photo = photoService.getPhoto(id);
        return dtoBuilder.build(photo);
    }

    @DELETE
    @Path("/{id}")
    @Produces("application/json")
    public Boolean delete(@PathParam("id") Long id) {
        photoService.deletePhoto(id);
        return Boolean.TRUE;
    }

    @PUT
    @Produces("application/json")
    @Consumes("application/json")
    public PhotoDto put(PhotoDto dto) {
        return save(dto);
    }

    @POST
    @Produces("application/json")
    @Consumes("application/json")
    public PhotoDto post(PhotoDto dto) {
        return save(dto);
    }

    private PhotoDto save(PhotoDto dto) {
        final Photo photo = photoService.savePhoto(
                dto.getId(),
                dto.getName(),
                dto.getContent(),
                dto.getContentType(),
                dto.getPublicData()
        );
        return dtoBuilder.build(photo);
    }


    @GET
    @Produces("application/json")
    public List<PhotoDto> list() {
        final List<Photo> photos = photoService.getPhotos();
        return dtoBuilder.build(photos);
    }
}
