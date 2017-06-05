package meetNow.logic;

public class MeetingNotFoundException extends Exception {

	private static final long serialVersionUID = 1L;

	public MeetingNotFoundException(String message) {
		super(message);
	}
}
