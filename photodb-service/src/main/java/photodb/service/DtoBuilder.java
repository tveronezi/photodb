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

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DtoBuilder {

    public PhotoDto buildPhoto(Photo photo) {
        final PhotoDto result = new PhotoDto();
        result.setUid(photo.getUid());
        result.setPath(photo.getPath());
        return result;
    }


    public CommentDto buildComment(Comment comment) {
        final CommentDto result = new CommentDto();
        result.setText(comment.getText());
        result.setTs(comment.getDate().getTime());
        return result;
    }

}
