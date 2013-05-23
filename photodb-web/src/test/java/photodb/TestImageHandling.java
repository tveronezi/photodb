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

package photodb;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.JavaArchive;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import photodb.cdi.DtoBuilder;
import photodb.cdi.ImageManager;
import photodb.data.dto.PhotoDto;
import photodb.data.entity.Photo;

import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@RunWith(Arquillian.class)
public class TestImageHandling {

    @Inject
    private DtoBuilder dtoBuilder;

    @Deployment
    public static JavaArchive createDeployment() {
        return ShrinkWrap.create(JavaArchive.class)
                .addClass(DtoBuilder.class)
                .addClass(ImageManager.class)
                .addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml");
    }

    private String getResourceContent(String path) {
        final InputStream contentStream = TestImageHandling.class.getClassLoader().getResourceAsStream(path);
        return new Scanner(contentStream, "UTF-8").useDelimiter("\\A").next();
    }

    private List<Photo> getNewPhoto(String contentPath) {
        final Photo photo = new Photo();
        photo.setContent(getResourceContent(contentPath));

        final List<Photo> photos = new ArrayList<Photo>();
        photos.add(photo);
        return photos;
    }

    @Test
    public void should_not_create_thumb() throws IOException {
        List<Photo> photos = getNewPhoto("photos/legend.base64");
        List<PhotoDto> dtos = dtoBuilder.build(photos);
        Assert.assertTrue(dtos.size() == 1);
        Assert.assertTrue(dtos.get(0).getContent().equals(getResourceContent("photos/legend.base64")));
    }

    @Test
    public void should_create_thumb() throws IOException {
        List<Photo> photos = getNewPhoto("photos/tomee.base64");
        List<PhotoDto> dtos = dtoBuilder.build(photos);
        Assert.assertTrue(dtos.size() == 1);
        Assert.assertFalse(dtos.get(0).getContent().equals(getResourceContent("photos/tomee.base64")));
    }

}
