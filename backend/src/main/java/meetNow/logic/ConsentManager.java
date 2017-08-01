package meetNow.logic;

import meetNow.api.exceptions.BadRequestException;

public interface ConsentManager {
	
	public void addDecision(String meetingId, String userId, Decision decision) throws BadRequestException;

}
