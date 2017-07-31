package meetNow.logic;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import meetNow.api.exceptions.ValidationException;
import meetNow.dataaccess.repositories.UserRepository;
import swagger.model.User;

@Component
public class SimpleUserCreator implements UserCreator {

	@Autowired
	private UserRepository repository;
	
	@Override
	public User createUser(String pushId) throws ValidationException {
		if(pushId == null || "".equals(pushId)){
			throw new ValidationException("No Push id supplied");
		}
		String secret = generateSecret();
		User user = new User();
		user.setId(pushId);
		user.setSecret(secret);
		user = repository.save(user);
		return user;
	}

	private String generateSecret() {
		SecureRandom random = new SecureRandom();
	    long secret = random.nextLong();
		return secret + "";
	}

}
