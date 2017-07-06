package meetNow.logic;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.annotation.RequestScope;

import meetNow.dataaccess.repositories.MeetingRepository;
import swagger.model.Meeting;

@Component
@RequestScope
public class MeetingManager implements MeetingProcessor {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private MeetingRepository repository;

//	@Autowired
//	private RestTemplate template;
	
	@Override
	public String processNewMeeting(Meeting meeting) {
		meeting = repository.save(meeting);
		logger.info("saved meeting {}", meeting);
		//TODO use template to send message to oneSignal
		//template.postForObject(url, request, responseType, uriVariables)
		return meeting.getId();
	}

	@Override
	public void updateMeeting(Meeting meeting) throws MeetingNotFoundException {
		Meeting oldMeeting = repository.findOne(meeting.getId());
		if (oldMeeting == null) {
			logger.warn("Tried to update meeting which does not exist, meeting: {}", meeting);
			throw new MeetingNotFoundException(String.format("Meeting with id %s does not exist", meeting.getId()));
		}
		verifyAuthorization();
		repository.save(meeting);
	}

	@Override
	public void deleteMeeting(Meeting meeting) throws MeetingNotFoundException {
		if (!repository.exists(meeting.getId())) {
			throw new MeetingNotFoundException(String
					.format("Meeting does not exist (id: %s), and therefore can not be deleted", meeting.getId()));
		}
		verifyAuthorization();
		repository.delete(meeting);
	}

	private void verifyAuthorization() {
		// TODO verify the user is allowed to change the meeting, otherwise
		// throw not authorized or something
	}
}
