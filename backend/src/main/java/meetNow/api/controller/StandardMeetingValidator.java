package meetNow.api.controller;

import java.util.List;

import org.springframework.stereotype.Component;

import meetNow.api.exceptions.ValidationException;
import swagger.model.Group;
import swagger.model.Meeting.ReoccurrenceEnum;
import swagger.model.Participant;

@Component
public class StandardMeetingValidator implements MeetingValidator {

	@Override
	public void checkReoccurrance(ReoccurrenceEnum reoccurence) throws ValidationException {
		if (reoccurence == null)
			throw new ValidationException("Reoccurrence is not set");
	}

	@Override
	public void checkOwnerId(String id) throws ValidationException {
		if (stringEmptyOrNull(id)) // TODO, verify the request sender has this id
			throw new ValidationException("Owner id is not valid");
	}

	@Override
	public void checkParticipantsAndGroups(List<Participant> participants, List<Group> groups)
			throws ValidationException {
		if (participants.size() == 0 && groups.size() == 0) {
			throw new ValidationException(
					"Group and participants are both empty, at least one of them needs to be filled");
		}
		checkParticipants(participants);
		checkGroups(groups);
	}

	private void checkGroups(List<Group> groups) throws ValidationException {
		for (Group group : groups) {
			String id = group.getId()+"";
			if (stringEmptyOrNull(id)) {
				throw new ValidationException("Invalid group id: " + id);
			}
			int size = group.getParticipants().size();
			if(size == 0){
				throw new ValidationException("Group has no particpants");
			}
			for (Participant participant : group.getParticipants()) {
				checkParticipant(participant);
			}
		}
	}

	private void checkParticipants(List<Participant> participants) throws ValidationException {
		for (Participant participant : participants) {
			checkParticipant(participant);
		}
	}

	private void checkParticipant(Participant participant) throws ValidationException {
		String id = participant.getId();
		if (stringEmptyOrNull(id)) {
			throw new ValidationException("Invalid participant id: " + id);
		}
	}
	
	private static boolean stringEmptyOrNull(String string){
		return string == null || "".equals(string);
	}
}
