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

package photodb.web.command.impl

import photodb.data.dto.PhotoDto
import photodb.service.ServiceFacade
import photodb.web.command.Command

import java.awt.AlphaComposite
import java.awt.Graphics2D
import java.awt.Image
import java.awt.image.BufferedImage
import javax.imageio.ImageIO
import javax.servlet.ServletRequest
import javax.servlet.ServletResponse

class DownloadPhoto implements Command {
    private static final int MAX_SIZE = 200

    // Taken from http://www.oracle.com/technetwork/java/faqs-137274.html#Q_How_do_I_create_a_resized_copy
    private BufferedImage createResizedCopy(Image originalImage,
                                            int scaledWidth, int scaledHeight,
                                            boolean preserveAlpha) {
        int imageType = preserveAlpha ? BufferedImage.TYPE_INT_RGB : BufferedImage.TYPE_INT_ARGB
        BufferedImage scaledBI = new BufferedImage(scaledWidth, scaledHeight, imageType)
        Graphics2D g = scaledBI.createGraphics()
        if (preserveAlpha) {
            g.setComposite(AlphaComposite.Src)
        }
        g.drawImage(originalImage, 0, 0, scaledWidth, scaledHeight, null)
        g.dispose()
        return scaledBI
    }

    private BufferedImage getThumb(File file, Integer maxSize) {
        def calculateScale = {
            values ->
            float scale = 1
            if (values.a > maxSize) {
                scale = maxSize / values.a
                values.a = maxSize
            }
            values.b = Math.round(values.b * scale)

        }

        BufferedImage original = ImageIO.read(file)
        int width = original.width
        int height = original.height

        def values = [a: width, b: height]
        calculateScale(values)

        width = values.a
        height = values.b

        values = [a: height, b: width]
        calculateScale(values)

        width = values.b
        height = values.a

        return createResizedCopy(original, width, height, true)
    }

    @Override
    def execute(ServiceFacade serviceFacade, ServletRequest req, ServletResponse resp) {
        Long uid = req.getParameter('uid') as Long
        Boolean original = req.getParameter('original') as Boolean
        PhotoDto dto = serviceFacade.getPhoto(uid)
        File file = new File(req.getRealPath('/WEB-INF/images'), dto.path)

        if (original) {
            resp.contentType = dto.mime
            file.withInputStream { is ->
                resp.outputStream << is
            }
        } else {
            resp.contentType = 'image/png'
            Integer maxSize = req.getParameter('maxSize') as Integer
            if(!maxSize) {
                maxSize = MAX_SIZE
            }
            ImageIO.write(getThumb(file, maxSize), "png", resp.outputStream)
        }

        resp.outputStream.flush()
        return resp
    }
}
