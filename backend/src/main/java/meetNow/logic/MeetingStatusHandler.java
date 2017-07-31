package meetNow.logic;

import meetNow.api.exceptions.BadRequestException;

public interface MeetingStatusHandler {
	
	void updateStatus(String meetingId, String userId, MeetingStatus status) throws BadRequestException;

}
