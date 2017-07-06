package meetNow.api.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import meetNow.api.exceptions.ValidationException;
import meetNow.dataaccess.repositories.MeetingRepository;
import meetNow.logic.CreateException;
import meetNow.logic.MeetingNotFoundException;
import meetNow.logic.MeetingProcessor;
import meetNow.logic.UserCreator;
import swagger.model.Meeting;
import swagger.model.User;

@CrossOrigin
@RestController
public class MobileAppController {

	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private MeetingValidator validator;

	@Autowired
	private MeetingProcessor manager;

	@Autowired
	private MeetingRepository repository;
	
	@Autowired
	private UserCreator userCreator;

	@RequestMapping("/test")
	public String testServerUp(String test) {
		return "OK";
	}

	@RequestMapping(value = "/newUser", produces = { "application/json" }, method = RequestMethod.POST)
	public ResponseEntity<User> newUser (@RequestPart(value = "pushId", required = true) String pushId) throws ValidationException {
		User user = userCreator.createUser(pushId);
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	@RequestMapping(value = "/meeting", consumes = { "application/json" }, method = RequestMethod.POST)
	@ResponseStatus(HttpStatus.CREATED)
	public @ResponseBody Map<String, String> addMeeting(@RequestBody Meeting meeting)
			throws ValidationException, CreateException {
		validator.validateMeeting(meeting);
		String id = manager.processNewMeeting(meeting);
		Map<String, String> responseBody = new HashMap<>();
		responseBody.put("id", id);
		return responseBody;
	}

	@RequestMapping(value = "/meeting", consumes = { "application/json" }, method = RequestMethod.PUT)
	@ResponseStatus(HttpStatus.OK)
	public void updateMeeting(@RequestBody Meeting meeting) throws ValidationException, MeetingNotFoundException {
		validator.validateMeetingId(meeting.getId());
		validator.validateMeeting(meeting);
		manager.updateMeeting(meeting);
	}

	@RequestMapping(value = "/meeting", consumes = { "application/json" }, method = RequestMethod.DELETE)
	@ResponseStatus(HttpStatus.OK)
	public void deleteMeeting(@RequestBody Meeting meeting) throws ValidationException, MeetingNotFoundException {
		validator.validateMeetingId(meeting.getId());
		manager.deleteMeeting(meeting);
	}

	@RequestMapping(value = "/meeting", method = RequestMethod.GET)
	@ResponseStatus(HttpStatus.OK)
	public Meeting getMeeting(@RequestParam String id) {
		Meeting meeting = repository.findOne(id);
		return meeting;
	}

	@RequestMapping(value = "/deleteAllMeetings", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteAll() {
		repository.deleteAll();
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@ExceptionHandler(MeetingNotFoundException.class)
	@ResponseStatus(HttpStatus.NOT_FOUND)
	public String handleMeetingNotFoundException(MeetingNotFoundException e) throws Exception {
		return e.getMessage();
	}

	@ExceptionHandler(ValidationException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public String handleValidationException(ValidationException e) throws Exception {
		return String.format("Validation failed: %s", e.getMessage());
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public @ResponseBody String handleRuntimeExceptions(Exception e, HttpServletRequest request,
			HttpServletResponse resp) {
		logger.error("An internal server error occurred while processing a request, method: {}, request {}, parameters",
				request.getMethod(), request.getRequestURL(), request.getParameterMap());
		logger.error("Exception: ", e);
		return "An internal error occurred";
	}

}