package meetNow.api.controller;

import meetNow.api.exceptions.ValidationException;
import swagger.model.Meeting;

public interface MeetingValidator {

	void validateMeeting(Meeting meeting) throws ValidationException;
	
	void validateMeetingId(String id) throws ValidationException;

}