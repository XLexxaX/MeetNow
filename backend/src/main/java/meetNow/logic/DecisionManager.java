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
import swagger.model.Meeting;

@Component
public class DecisionManager implements ConsentManager {

	private Map<String, List<User>> meetingDecisionMap = new HashMap<>();
	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private MeetingRepository meetingRepo;

	@Autowired
	private PushServiceMessenger messenger;

	@Override
	public void addDecision(String meetingId, String userId, Decision decision) throws BadRequestException {
		logger.info("MeetingId: {}, UserId {}, Decision {} ", meetingId, userId, decision);

		Meeting meeting = meetingRepo.findOne(meetingId);
		
		if (meeting == null) {
			logger.info("Meeting id not recognized : {}", meetingId);
			throw new BadRequestException("Meeting id not recognized");
		}
		
		List<User> decisions = meetingDecisionMap.get(meetingId);
		if (decisions == null) {
			decisions = Collections.synchronizedList(new LinkedList<>());
			meetingDecisionMap.put(meetingId, decisions);
		}

		decisions.add(new User(userId, decision));

		int numberOfDecisions = decisions.size();
		int neededDecisions = meeting.getParticipants().size() + 1;
		logger.info("Received decisions: {} , needed decisions {}", numberOfDecisions, neededDecisions);

		if (numberOfDecisions == neededDecisions) {
			boolean meetNow = true;
			for (User u : decisions) {
				if (Decision.NO.equals(u.decision)) {
					meetNow = false;
					break;
				}
			}
			if (meetNow) {
				messenger.postNotification("MeetNow! Meeting starts!", meeting, 5);
			}
		}
	}

	private class User {

		private String userId;
		private Decision decision;

		public User(String userId, Decision decision) {
			this.userId = userId;
			this.decision = decision;
		}

	}
}
