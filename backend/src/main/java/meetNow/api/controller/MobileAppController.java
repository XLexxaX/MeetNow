package meetNow.api.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import meetNow.api.exceptions.ValidationException;
import meetNow.logic.MeetingProcessor;
import swagger.model.Meeting;

@RestController
public class MobileAppController {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private MeetingValidator validator;

	@Autowired
	private MeetingProcessor manager;

	@RequestMapping("/test")
	public String testServerUp(String test) {
		return "OK";
	}

	@RequestMapping(value = "/meeting", consumes = { "application/json" }, produces = {
			"application/json" }, method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public @ResponseBody Map<String, String> addMeeting(@RequestBody Meeting meeting) throws ValidationException {
		validateMeeting(meeting);
		String id = manager.processNewMeeting(meeting);
		Map<String, String> responseBody = new HashMap<>();
		responseBody.put("id", id);
		return responseBody;
	}

	@RequestMapping(value = "/meeting", consumes = { "application/json" }, produces = {
			"application/json" }, method = RequestMethod.PUT)
	@ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
	public @ResponseBody Map<String, String> updateMeeting(@RequestBody Meeting meeting) throws ValidationException {
		return null;
	}

	@RequestMapping(value = "/meeting", consumes = { "application/json" }, produces = {
			"application/json" }, method = RequestMethod.DELETE)
	@ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
	public @ResponseBody Map<String, String> deleteMeeting(@RequestBody Meeting meeting) throws ValidationException {
		return null;
	}

	@ExceptionHandler(ValidationException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public @ResponseBody Map<String, Object> handleIndexNotFoundException(ValidationException e) throws Exception {
		HashMap<String, Object> result = new HashMap<>();
		result.put("Validation failed", e.getMessage());
		return result;
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public @ResponseBody Map<String, Object> handleIndexNotFoundException(Exception e, HttpServletRequest request,
			HttpServletResponse resp) {
		logger.error("An internal server error occurred, request {} raised exception", request.getRequestURL());
		logger.error("Exception: {}", e);
		HashMap<String, Object> result = new HashMap<>();
		result.put("error", "An internal error occurred");
		return result;
	}

	private void validateMeeting(Meeting meeting) throws ValidationException {
		validator.checkOwnerId(meeting.getOwnerId());
		validator.checkReoccurrance(meeting.getReoccurrence());
		validator.checkParticipantsAndGroups(meeting.getParticipants(), meeting.getGroups());
	}

}