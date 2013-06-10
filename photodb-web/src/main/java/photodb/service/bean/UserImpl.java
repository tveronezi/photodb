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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import photodb.data.entity.User;
import photodb.service.ApplicationException;

import javax.annotation.Resource;
import javax.ejb.EJB;
import javax.ejb.SessionContext;
import javax.ejb.Stateless;
import javax.jms.*;

@Stateless
public class UserImpl {

    private static final Logger LOG = LoggerFactory.getLogger(UserImpl.class);

    @Resource
    private ConnectionFactory factory;

    @Resource(name = "CreateUpdateUserQueue")
    private Queue requestUserQueue;

    @EJB
    private BaseEAO baseEAO;

    @Resource
    private SessionContext ctx;

    public User createUser(String name) {
        final User user = new User();
        user.setName(name);
        return this.baseEAO.create(user);
    }

    public User getUser(String name) {
        return this.baseEAO.find(User.class, "name", name);
    }

    public User getUser() {
        if (!this.ctx.isCallerInRole("photo-user")) {
            return null;
        }
        final String userName = this.ctx.getCallerPrincipal().getName();
        User user = getUser(userName);
        if (user == null) {
            // createUser is a local method. Therefore, the server wont inject the transaction if we call it from here.
            // That's why this getUser() method should have the REQUIRED annotation.
            user = createUser(userName);
        }
        return user;
    }

    public void requestUser(String userName, String userAccount, String userPassword) throws ArithmeticException {
        try {
            sendRequest(userName, userAccount, userPassword);
        } catch (Exception e) {
            LOG.error("Impossible to request a new user", e);
            throw new ApplicationException(e);
        }
    }

    private void sendRequest(String userName, String userAccount, String userPassword) throws JMSException {
        LOG.info("Sending new user request");

        Connection connection = null;
        javax.jms.Session session = null;

        try {
            connection = this.factory.createConnection();
            connection.start();

            // Create a Session
            session = connection.createSession(false, javax.jms.Session.AUTO_ACKNOWLEDGE);

            // Create a MessageProducer from the Session to the Topic or Queue
            MessageProducer producer = session.createProducer(this.requestUserQueue);
            producer.setDeliveryMode(DeliveryMode.NON_PERSISTENT);

            // Create a message
            Message message = session.createMessage();
            message.setStringProperty("userAccount", userAccount);
            message.setStringProperty("userPassword", userPassword);
            message.setStringProperty("userGroup", "photo-user");
            message.setStringProperty("userName", userName);

            // Tell the producer to send the message
            producer.send(message);
        } finally {
            // Clean up
            if (session != null) {
                session.close();
            }
            if (connection != null) {
                connection.close();
            }
        }

        LOG.info("The new user request was successful");
    }

}
