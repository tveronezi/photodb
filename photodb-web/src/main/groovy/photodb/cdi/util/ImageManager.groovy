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

package photodb.cdi.util

import org.apache.commons.codec.binary.Base64

import javax.enterprise.context.ApplicationScoped
import javax.imageio.ImageIO
import java.awt.*
import java.awt.image.BufferedImage

@ApplicationScoped
class ImageManager {
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

    private BufferedImage getResizedImage(BufferedImage original, Integer maxSize) {
        def calculateScale = {
            values ->
                float scale = 1
                if (values.a > maxSize) {
                    scale = maxSize / values.a
                    values.a = maxSize
                }
                values.b = Math.round(values.b * scale)

        }

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

    private BufferedImage getFromBase64(String base64) {
        byte[] decoded = Base64.decodeBase64(base64.replaceAll('^data:.*;base64,', ''))
        InputStream input = new ByteArrayInputStream(decoded)
        return ImageIO.read(input)
    }



    String getThumb(String originalBase64) {
        BufferedImage original = getFromBase64(originalBase64)
        BufferedImage resized = getResizedImage(original, MAX_SIZE)

        ByteArrayOutputStream baos = new ByteArrayOutputStream()
        ImageIO.write(resized, 'png', baos)
        baos.flush()
        byte[] imageInByte = baos.toByteArray()
        baos.close()

        String encoded = Base64.encodeBase64String(imageInByte)
        return 'data:image/png;base64,' + encoded
    }

}
