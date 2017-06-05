package meetNow.logic;

import swagger.model.Meeting;

public interface MeetingProcessor {

	String processNewMeeting(Meeting meeting) throws CreateException;

	void updateMeeting(Meeting meeting) throws MeetingNotFoundException;

	void deleteMeeting(Meeting meeting) throws MeetingNotFoundException;

}