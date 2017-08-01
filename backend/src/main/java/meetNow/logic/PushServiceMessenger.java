package meetNow.logic;

import swagger.model.Meeting;

public interface PushServiceMessenger {
	
	public void postNotification(String message, Meeting meeting, int operationId);

}
