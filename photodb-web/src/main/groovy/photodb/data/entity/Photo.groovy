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

package photodb.data.entity

import javax.persistence.*

@Entity
@Table(name = 'photodb_photo_tbl')
class Photo extends BaseEntity {

    @Column(nullable = false)
    String fileName;

    @Column(nullable = false)
    @Lob
    String content;

    @Column(nullable = false)
    String contentType;

    @Column(nullable = false)
    Boolean publicData

    @ManyToOne(optional = false)
    @JoinColumn(name = "usr_id", nullable = false, updatable = false)
    User user

}
