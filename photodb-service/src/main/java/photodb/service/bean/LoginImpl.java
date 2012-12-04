package photodb.service.bean;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import java.util.*;

@Stateless
public class LoginImpl {

    @EJB
    private UserImpl userImpl;

    // TODO: Add authentication logic here
    public List<String> authenticate(String user, String password) {
        final Map<String, String> userPass = new HashMap<String, String>();
        final Map<String, List<String>> userGroups = new HashMap<String, List<String>>();

        userPass.put("paul", "michelle");
        userPass.put("eddie", "jump");
        userPass.put("michael", "bad");
        userPass.put("andreas", "roots");

        userGroups.put("paul", Arrays.asList("photo-admin", "photo-user"));
        userGroups.put("eddie", Arrays.asList("photo-user"));
        userGroups.put("michael", Arrays.asList("tomee-admin", "photo-admin", "photo-user"));
        userGroups.put("andreas", Collections.EMPTY_LIST);

        final String pass = userPass.get(user);
        if (password.equals(pass)) {
            if (this.userImpl.getUser(user) == null) {
                this.userImpl.createUser(user);
            }
            return userGroups.get(user);
        }

        throw new RuntimeException("Bad user or password!");
    }
}
