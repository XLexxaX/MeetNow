package meetNow.api.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import meetNow.api.exceptions.ValidationException;
import meetNow.meeting.MeetingManager;
import swagger.model.Meeting;

@RestController
public class MobileAppController {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private MeetingValidator validator;

	@Autowired
	private MeetingManager manager;

	@RequestMapping("/test")
	public String testServerUp(String test) {
		return "OK";
	}

	@RequestMapping(value = "/meeting", produces = { "application/json" }, consumes = {
			"application/json" }, method = RequestMethod.POST)
	public ResponseEntity<Integer> addMeeting(@RequestBody Meeting meeting) throws ValidationException {
		validateMeeting(meeting);
		int id = manager.processNewMeeting();
		return new ResponseEntity<Integer>(id, HttpStatus.OK);
	}

	@ExceptionHandler(ValidationException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public @ResponseBody Map<String, Object> handleIndexNotFoundException(ValidationException e) throws Exception {
		HashMap<String, Object> result = new HashMap<>();
		result.put("Validation failed", e.getMessage());
//		throw new Exception("test");
		return result;
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public @ResponseBody Map<String, Object> handleIndexNotFoundException(Exception e,
			HttpServletRequest request, HttpServletResponse resp) {
		logger.error("An internal server error occurred, request {} raised exception {}", request.getRequestURL(), e);
		HashMap<String, Object> result = new HashMap<>();
		result.put("error" , "An internal error occurred");
		return result;
	}

	private void validateMeeting(Meeting meeting) throws ValidationException {
		validator.checkOwnerId(meeting.getOwnerId());
		validator.checkReoccurrance(meeting.getReoccurrence());
		validator.checkParticipantsAndGroups(meeting.getParticipants(), meeting.getGroups());
	}

}