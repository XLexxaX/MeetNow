package meetNow.api.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import meetNow.api.exceptions.BadRequestException;
import meetNow.api.exceptions.ValidationException;
import meetNow.dataaccess.repositories.MeetingRepository;
import meetNow.dataaccess.repositories.UserRepository;
import meetNow.logic.ConsentManager;
import meetNow.logic.CreateException;
import meetNow.logic.Decision;
import meetNow.logic.MeetingNotFoundException;
import meetNow.logic.MeetingProcessor;
import meetNow.logic.MeetingStatus;
import meetNow.logic.MeetingStatusHandler;
import meetNow.logic.UserCreator;
import swagger.model.Meeting;
import swagger.model.Participant;
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
	private MeetingRepository meetingRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private UserCreator userCreator;

	@Autowired
	private MeetingStatusHandler handler;

	@Autowired
	private ConsentManager consentManager;

	@RequestMapping("/test")
	public String testServerUp(String test) {
		return "OK";
	}

	@RequestMapping(value = "/newUser", consumes = { "application/x-www-form-urlencoded" }, produces = {
			"application/json" }, method = RequestMethod.POST)
	public ResponseEntity<User> newUser(@RequestBody MultiValueMap<String, String> paramMap)
			throws ValidationException {
		User user = userCreator.createUser(paramMap.get("pushId").get(0));
		return new ResponseEntity<User>(user, HttpStatus.OK);
	}

	@RequestMapping(value = "/meetings", produces = { "application/json" }, consumes = {
			"application/x-www-form-urlencoded" }, method = RequestMethod.POST)
	public ResponseEntity<List<Meeting>> getMeetings(@RequestBody MultiValueMap<String, String> paramMap)
			throws BadRequestException {
		String userId = paramMap.getFirst("userId");
		String secret = paramMap.getFirst("secret");

		User user = userRepo.findOne(userId);
		logger.info("Found user {}", user);
		if (user == null || !user.getSecret().equals(secret.trim())) {
			throw new BadRequestException("Authentification failed");
		}

		List<Meeting> meetings = meetingRepo.findAll();
		List<Meeting> meetingsWithParticipation = new ArrayList<>();
		for (Meeting meeting : meetings) {
			if (meeting.getOwnerId().equals(userId)) {
				meetingsWithParticipation.add(meeting);
			} else {
				for (Participant p : meeting.getParticipants()) {
					if (p.getId().equals(userId)) {
						meetingsWithParticipation.add(meeting);
						break;
					}
				}

			}
		}
		return new ResponseEntity<List<Meeting>>(meetingsWithParticipation, HttpStatus.OK);
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
		Meeting meeting = meetingRepo.findOne(id);
		return meeting;
	}

	@RequestMapping(value = "/deleteAllMeetings", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteAllMeetings() {
		meetingRepo.deleteAll();
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/deleteAllUsers", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteAllUser() {
		userRepo.deleteAll();
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/enterArea", produces = { "application/json" }, consumes = {
			"application/x-www-form-urlencoded" }, method = RequestMethod.POST)
	public ResponseEntity<Void> enterArea(@RequestBody MultiValueMap<String, String> paramMap)
			throws BadRequestException {
		String meetingId = paramMap.getFirst("meetingId");
		String userId = paramMap.getFirst("userId");
		handler.updateStatus(meetingId, userId, MeetingStatus.ENTER);
		return new ResponseEntity<Void>(HttpStatus.OK);
	}

	@RequestMapping(value = "/leaveArea", produces = { "application/json" }, consumes = {
			"application/x-www-form-urlencoded" }, method = RequestMethod.POST)
	public ResponseEntity<Void> leaveArea(@RequestBody MultiValueMap<String, String> paramMap)
			throws BadRequestException {
		String meetingId = paramMap.getFirst("meetingId");
		String userId = paramMap.getFirst("userId");
		handler.updateStatus(meetingId, userId, MeetingStatus.LEAVE);
		return new ResponseEntity<Void>(HttpStatus.OK);
	}

	@RequestMapping(value = "/consent", produces = { "application/json" }, consumes = {
			"application/x-www-form-urlencoded" }, method = RequestMethod.POST)
	ResponseEntity<Void> handleConsent(@RequestBody MultiValueMap<String, String> paramMap) throws BadRequestException {
		String meetingId = paramMap.getFirst("meetingId");
		String userId = paramMap.getFirst("userId");
		Decision decision = paramMap.getFirst("hasTime").equals("yes") ? Decision.YES : Decision.NO;
		consentManager.addDecision(meetingId, userId, decision);
		return new ResponseEntity<Void>(HttpStatus.OK);
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

	@ExceptionHandler(BadRequestException.class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	public String handleBadRequestException(BadRequestException e) throws Exception {
		return e.getMessage();
	}

	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public String handleRuntimeExceptions(Exception e, HttpServletRequest request,
			HttpServletResponse resp) {
		logger.error("An internal server error occurred while processing a request, method: {}, request {}, parameters",
				request.getMethod(), request.getRequestURL(), request.getParameterMap());
		logger.error("Exception: ", e);
		return "An internal error occurred";
	}

}