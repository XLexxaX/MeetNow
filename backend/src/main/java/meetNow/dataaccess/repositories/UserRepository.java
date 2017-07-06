package meetNow.dataaccess.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import swagger.model.User;

public interface UserRepository extends MongoRepository<User, String> {

}
