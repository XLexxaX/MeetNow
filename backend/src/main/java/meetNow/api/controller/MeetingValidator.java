package meetNow.api.controller;

import java.util.List;

import meetNow.api.exceptions.ValidationException;
import swagger.model.Group;
import swagger.model.Participant;
import swagger.model.Meeting.ReoccurrenceEnum;

public interface MeetingValidator {

	void checkReoccurrance(ReoccurrenceEnum reoccurence) throws ValidationException;

	void checkOwnerId(String string) throws ValidationException;

	void checkParticipantsAndGroups(List<Participant> participants, List<Group> groups) throws ValidationException;

}