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

    @Override
    public Long createPhoto(String path, String fileName, String contentType, Integer x, Integer y) {
        final Photo photo = this.photoService.createPhoto(path, fileName, contentType, x, y);
        return photo.getUid();
    }

    @Override
    public Long createComment(Long photoUid, String text) {
        final Comment comment = this.photoService.createComment(photoUid, text);
        return comment.getUid();
    }

    @Override
    public List<Map<String, Object>> getComments(Long photoUid) {
        final List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
        final Set<Comment> comments = this.photoService.getComments(photoUid);
        for (Comment comment : comments) {
            final Map<String, Object> data = new HashMap<String, Object>();
            data.put("text", comment.getText());
            data.put("date", comment.getDate());
            result.add(data);
        }
        Collections.sort(result, new Comparator<Map<String, Object>>() {
            @Override
            public int compare(Map<String, Object> a, Map<String, Object> b) {
                final Date dateA = (Date) a.get("date");
                final Date dateB = (Date) b.get("date");
                return dateA.compareTo(dateB);
            }
        });
        return result;
    }
}
