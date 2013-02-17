package photodb.service;

import photodb.service.bean.UserImpl;

import javax.ejb.EJB;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

@WebListener
public class UserSessionListener implements HttpSessionListener {
    @EJB
    private UserImpl userService;

    @Override
    public void sessionCreated(HttpSessionEvent httpSessionEvent) {
        // create user object if it is not already created
        userService.getUser();
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent httpSessionEvent) {
        // no-op
    }
}
