package meetNow.dataaccess.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import swagger.model.Meeting;

public interface MeetingRepository extends MongoRepository<Meeting, String> {
	
	List<Meeting> findByOwnerId(String ownerId);

}
