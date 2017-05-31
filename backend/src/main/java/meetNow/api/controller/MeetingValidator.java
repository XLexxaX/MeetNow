package meetNow.api.controller;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import meetNow.api.exceptions.ValidationException;
import swagger.model.Group;
import swagger.model.Meeting.ReoccurrenceEnum;
import swagger.model.Participant;

@RequestScope
@Component
public class MeetingValidator {

	public void checkReoccurrance(ReoccurrenceEnum reoccurence) throws ValidationException {
		if (reoccurence == null)
			throw new ValidationException("Reoccurrence is not set");
	}

	public void checkOwnerId(Integer id) throws ValidationException {
		if (id == null || id == 0) // TODO, verify the request sender has this id
			throw new ValidationException("Owner id is not valid");
	}

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
			int id = group.getId();
			if (id == 0) {
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
		if (id == null || "".equals(id)) {
			throw new ValidationException("Invalid participant id: " + id);
		}
	}

}
