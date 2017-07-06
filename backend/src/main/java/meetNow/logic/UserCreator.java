package meetNow.logic;

import meetNow.api.exceptions.ValidationException;
import swagger.model.User;

public interface UserCreator {

	public User createUser(String pushId) throws ValidationException;
}
