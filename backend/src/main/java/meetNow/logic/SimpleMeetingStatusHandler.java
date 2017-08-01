package meetNow.logic;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import meetNow.api.exceptions.BadRequestException;
import meetNow.dataaccess.repositories.MeetingRepository;
import meetNow.dataaccess.repositories.UserRepository;
import swagger.model.Meeting;
import swagger.model.User;

@Component
public class SimpleMeetingStatusHandler implements MeetingStatusHandler {

	@Autowired
	private MeetingRepository meetingRepo;

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private PushServiceMessenger messenger;

	private Map<String, List<User>> activeMeetings = new HashMap<>();
	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void updateStatus(String meetingId, String userId, MeetingStatus status) throws BadRequestException {
		switch (status) {
		case ENTER:
			User user = userRepo.findOne(userId);
			if (user == null) {
				throw new BadRequestException("User id not found in DB");
			}

			Meeting meeting = meetingRepo.findOne(meetingId);
			if (meeting == null) {
				throw new BadRequestException("Meeting id not found in DB");
			}

			List<User> usersInMeeting = activeMeetings.get(meetingId);
			if (usersInMeeting == null) {
				usersInMeeting = Collections.synchronizedList(new LinkedList<>());
				usersInMeeting.add(user);
				activeMeetings.put(meetingId, usersInMeeting);
			} else {
				usersInMeeting.add(user);
				boolean allInArea = checkIfAllParticipantsInMeeting(meeting, usersInMeeting);
				if(allInArea){
					activeMeetings.remove(meetingId);
				}
			}

			break;
		case LEAVE:
			user = userRepo.findOne(userId);

			if (user == null) {
				throw new BadRequestException("User id not found in DB");
			}

			meeting = meetingRepo.findOne(meetingId);
			if (meeting == null) {
				throw new BadRequestException("Meeting id not found in DB");
			}

			usersInMeeting = activeMeetings.get(meetingId);
			if (usersInMeeting == null) {
				logger.error("User not in an area");
			} else {
				usersInMeeting.remove(user);
			}
			
			if(usersInMeeting.size() == 0){
				activeMeetings.remove(meeting.getId());
			}
			break;

		}

	}

	private boolean checkIfAllParticipantsInMeeting(Meeting meeting, List<User> usersInMeeting) {
		int numberOfParticpants = meeting.getParticipants().size() + 1; // +1
																		// for
																		// owner
		int activeParticipants = usersInMeeting.size();
		logger.info("Checking if all participants in Meeting, current {}, wanted {}", activeParticipants,
				numberOfParticpants);
		if (numberOfParticpants == activeParticipants) {
			messenger.postNotification("Meeting could start, please commit if you have time", meeting, 4);
			return true;
		}
		return false;

	}

}
