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

package photodb.data.entity;

import javax.persistence.*;

@Entity
@Table(name = "photodb_photo_tbl")
public class Photo extends BaseEntity {

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    @Lob
    private String content;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private Boolean publicData;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usr_id", nullable = false, updatable = false)
    private User user;

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Boolean getPublicData() {
        return publicData;
    }

    public void setPublicData(Boolean publicData) {
        this.publicData = publicData;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
