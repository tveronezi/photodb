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

import photodb.data.entity.Comment;
import photodb.data.entity.Photo;
import photodb.data.execution.BaseEAO;
import photodb.data.execution.command.CreateComment;
import photodb.data.execution.command.CreatePhoto;
import photodb.data.execution.command.GetPhotoComments;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import java.util.List;
import java.util.Set;

@Stateless
public class PhotoImpl {
    @EJB
    private BaseEAO baseEAO;

    public Photo createPhoto(String path, String fileName, String contentType, Integer x, Integer y) {
        final CreatePhoto create = new CreatePhoto();
        create.path = path;
        create.fileName = fileName;
        create.contentType = contentType;
        create.x = x;
        create.y = y;
        return this.baseEAO.execute(create);
    }

    public Comment createComment(Long photoUid, String comment) {
        final CreateComment create = new CreateComment();
        create.photoUid = photoUid;
        create.comment = comment;
        return this.baseEAO.execute(create);
    }

    public Set<Comment> getComments(Long photoUid) {
        final GetPhotoComments get = new GetPhotoComments();
        get.photoUid = photoUid;
        return this.baseEAO.execute(get);
    }

    public List<Photo> getPhotos() {
        // TODO no security yet. Just get all the photos
        return this.baseEAO.findAll(Photo.class);
    }
}
