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

package photodb.cdi;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@ApplicationScoped
public class ImageManager {
    private static final Logger LOG = LoggerFactory.getLogger(ImageManager.class);
    private static final int MAX_SIZE = 200;

    // Taken from http://www.oracle.com/technetwork/java/faqs-137274.html#Q_How_do_I_create_a_resized_copy
    private BufferedImage createResizedCopy(final Image originalImage,
                                            final int scaledWidth, final int scaledHeight,
                                            final boolean preserveAlpha) {
        final int imageType = preserveAlpha ? BufferedImage.TYPE_INT_RGB : BufferedImage.TYPE_INT_ARGB;
        final BufferedImage scaledBI = new BufferedImage(scaledWidth, scaledHeight, imageType);
        final Graphics2D g = scaledBI.createGraphics();
        if (preserveAlpha) {
            g.setComposite(AlphaComposite.Src);
        }
        g.drawImage(originalImage, 0, 0, scaledWidth, scaledHeight, null);
        g.dispose();
        return scaledBI;
    }

    private void calculateScale(final Integer maxSize, final Values values) {
        float scale = 1;
        if (values.a > maxSize) {
            scale = maxSize / values.a;
            values.a = maxSize;
        }
        values.b = Math.round(values.b * scale);
    }

    private BufferedImage getResizedImage(final BufferedImage original) {
        int width = original.getWidth();
        int height = original.getHeight();

        Values values = new Values(width, height);
        calculateScale(MAX_SIZE, values);

        width = Math.round(values.a);
        height = Math.round(values.b);

        values = new Values(height, width);
        calculateScale(MAX_SIZE, values);

        width = Math.round(values.b);
        height = Math.round(values.a);

        return createResizedCopy(original, width, height, true);
    }

    public BufferedImage getFromBase64(final String base64) throws IOException {
        final byte[] decoded = Base64.decodeBase64(base64.replaceAll("^data:.*;base64,", ""));
        final InputStream input = new ByteArrayInputStream(decoded);
        return ImageIO.read(input);
    }

    public String getThumb(final String originalBase64) throws IOException {
        final BufferedImage original = getFromBase64(originalBase64);
        final BufferedImage resized = getResizedImage(original);

        final ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(resized, "png", baos);
        baos.flush();
        final byte[] imageInByte = baos.toByteArray();
        baos.close();

        final String encoded = Base64.encodeBase64String(imageInByte);
        final String thumb = "data:image/png;base64," + encoded;
        final int originalSize = originalBase64.length();
        final int thumbSize = thumb.length();
        if (originalSize < thumbSize) {
            return originalBase64;
        }
        LOG.debug("Shrinking photo content from {} to {}", originalSize, thumbSize);
        return thumb;
    }

    private class Values {
        public float a;
        public float b;

        private Values(float a, float b) {
            this.a = a;
            this.b = b;
        }
    }
}
