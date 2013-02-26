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

package photodb

import junit.framework.Assert
import org.junit.Test
import photodb.cdi.util.ImageManager

class TestImageManager {

    private String strImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAICAMAAAA7vaRv" +
            "AAAAAXNSR0IArs4c6QAAAvpQTFRF9FRWw8bHjo+RbydW3d3erVNK6+vsnxtAkam6VS1tpyt1////spCQrpFc" +
            "MiIx3t7fyHBUs2pRtydszFNOuqpj2x1Yr5t7oLjJ1uTlz5JmajSXsip0TChU18hvubi5/vGC/NV+eImWrMXV" +
            "mFVJdzST+vr6oqSm+OZ9iDGJ6BZOjnVQxRlI+5hnw61k9BhR1yBd1xhK4OHitRtFqzCDZm93YiJAqRpC9BVO" +
            "7BlSmCFM+4pjmy17wbmwzCNisWt4+GNa98t6zIVZ0yJigTWW59h2hiZWh5uqxiFc4YZfmSVXrChm5BpUZDKK" +
            "Ix4h4h1ZfTGMpCVakR5B9fX1kzGG93RdxrRn6Mh1cX2G5OXmW0058fHxGBQYREA/lihksFNphypn+6Zr9zZS" +
            "tiNb5OrqiC104ubotrSrxHpu5idJoitBinRs0tPUwSZplYp+eyle1DmIpzpDs6alsiZEWWZy0bhsyR1RiyJK" +
            "1drd4uPmeS1zrrO2Yyld4mdVwyRk4eLkmC+B71yJn5ubtZ5e9CpQf2lMx9Pa8pKK6g1JvRRDXjOP0MzK7fDw" +
            "Yi1vwrd77xZQjVRgyiVo0ato3nhZ/dx/sjZG8iFOa1lAHx0cvypK1g9G+X9hvB9U35hhvK+066Nl0ClO/b1z" +
            "5LZtrIB/PSdBo4JWwChu6BtXzsTA5r9yuD5b/bNu5DJOw5qHazB8pqyxy6Nl7O3umTWS3x9dz9jf7o1gdi99" +
            "2tnZ279vhDee0h5XlS52jTCA8fb1wKOT9w5KoUNEtjBiqB9l4BVOoi19ytHP0T9LvT5H2trb9ENSyszOVFRY" +
            "gy9+2N7h397ex1xu3tzb4ePjlkBbcDKJx7y85OLh7+/v9/f3gUNBlTNCcSxp7zFPvCtz3Nzd8vLy2NXVbjWc" +
            "xydrZi6SyDZc9vb23ufn39/gyA9D/Pz8+Pj48/T0v8DAXS98/7OCKSIo+/v79Pj3/Pv74UVOY2BlkStt5ufo" +
            "6OnpeSFE4ODg4+PjwZ1l29vdz9jY39vXqiBPpvfSNQAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIW" +
            "XMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QIZEAUAVPS5EQAAAIpJREFUCNdjaGRgqGLADi7zcVwW0v+meQRTit" +
            "93+muVw9Kif7UXocmcdEs6PX26lIqXbYCoxYlEMWQ5Ye1dzs6LfX0/18fn6d8/OnvNV5gMd/mbqXqWD5Ye3sE" +
            "3ffp0zoDA+fIlCMsYr8s3a1r0sVvE3l7qVzt5hQiyoUEvWVhYIs4Y8t/h52fhBgB5wiwqOaZSKAAAAABJRU5E" +
            "rkJggg=="

    @Test
    void testMe() {
        ImageManager imageManager = new ImageManager()
        String image = imageManager.getThumb(strImage)
        Assert.assertNotNull(image);
    }

}