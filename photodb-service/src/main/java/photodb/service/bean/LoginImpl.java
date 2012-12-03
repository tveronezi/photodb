package photodb.service.bean;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.security.auth.login.FailedLoginException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Stateless
public class LoginImpl {

    @EJB
    private UserImpl userImpl;

    public List<String> authenticate(String user, String password) throws FailedLoginException {
        // TODO: Add authentication logic here
        final List<String> groups = new ArrayList<String>();
        if ("paul".equals(user) && "michelle".equals(password)) {
            groups.addAll(Arrays.asList("Manager", "rockstar", "beatle"));
        } else if ("eddie".equals(user) && "jump".equals(password)) {
            groups.addAll(Arrays.asList("Manager", "rockstar", "beatle"));
        } else {
            throw new FailedLoginException("Bad user or password!");
        }

        if (this.userImpl.getUser(user) == null) {
            this.userImpl.createUser(user);
        }
        return groups;
    }
}
