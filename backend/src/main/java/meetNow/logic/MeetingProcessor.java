package meetNow.logic;

import swagger.model.Meeting;

public interface MeetingProcessor {

	String processNewMeeting(Meeting meeting);
	
	boolean updateMeeting(Meeting meeting);
	
	boolean deleteMeeting(Meeting meeting);

}