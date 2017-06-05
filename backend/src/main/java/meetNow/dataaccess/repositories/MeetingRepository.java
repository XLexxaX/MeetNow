package meetNow.dataaccess.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import swagger.model.Meeting;

public interface MeetingRepository extends MongoRepository<Meeting, String> {

}
