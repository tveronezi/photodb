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


import photodb.data.dto.CommentDto;
import photodb.data.dto.PhotoDto;
import photodb.data.entity.Comment;
import photodb.data.entity.Photo;
import photodb.service.bean.PhotoImpl;

import javax.ejb.EJB;
import javax.ejb.Remote;
import javax.ejb.Stateless;
import java.util.*;

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

    private DtoBuilder dtoBuilder = new DtoBuilder();

    @Override
    public Long createPhoto(String path, String fileName, String contentType, Integer x, Integer y) {
        final Photo photo = this.photoService.createPhoto(path, fileName, contentType, x, y);
        return photo.getUid();
    }

    @Override
    public Set<PhotoDto> getAllPhotoDtos() {
        // TODO: security. No security yet. Just get all the photos
        final List<Photo> photos = this.photoService.getPhotos();
        final Set<PhotoDto> result = new HashSet<PhotoDto>();
        for (Photo photo : photos) {
            result.add(this.dtoBuilder.buildPhoto(photo));
        }
        return result;

    }

    @Override
    public Long createComment(Long photoUid, String text) {
        // TODO: security.
        final Comment comment = this.photoService.createComment(photoUid, text);
        return comment.getUid();
    }

    @Override
    public Set<CommentDto> getComments(Long photoUid) {
        // TODO: security.
        final Set<CommentDto> result = new TreeSet<CommentDto>(new Comparator<CommentDto>() {
            @Override
            public int compare(CommentDto a, CommentDto b) {
                return a.getTs().compareTo(b.getTs());
            }
        });
        final Set<Comment> comments = this.photoService.getComments(photoUid);
        for (Comment comment : comments) {
            result.add(dtoBuilder.buildComment(comment));
        }
        return result;
    }
}
