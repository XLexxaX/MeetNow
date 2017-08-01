package meetNow.logic;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import meetNow.api.exceptions.BadRequestException;
import meetNow.configuration.ApiProperties;
import meetNow.dataaccess.repositories.MeetingRepository;
import meetNow.dataaccess.repositories.UserRepository;
import swagger.model.Meeting;
import swagger.model.Participant;
import swagger.model.User;

@Component
public class SimpleMeetingStatusHandler implements MeetingStatusHandler {

	@Autowired
	private MeetingRepository meetingRepo;

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private ApiProperties properties;

	private Map<String, List<User>> activeMeetings = new HashMap<>();
	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void updateStatus(String meetingId, String userId, MeetingStatus status) throws BadRequestException {
		switch (status) {
		case ENTER:
			User user = userRepo.findOne(userId);
			if (user == null) {
				throw new BadRequestException("User id not found in DB");
			}

			Meeting meeting = meetingRepo.findOne(meetingId);
			if (meeting == null) {
				throw new BadRequestException("Meeting id not found in DB");
			}

			List<User> usersInMeeting = activeMeetings.get(meetingId);
			if (usersInMeeting == null) {
				usersInMeeting = Collections.synchronizedList(new LinkedList<>());
				usersInMeeting.add(user);
				activeMeetings.put(meetingId, usersInMeeting);
			} else {
				usersInMeeting.add(user);
				CheckIfAllParticipantsInMeeting(meeting, usersInMeeting);
			}

			break;
		case LEAVE: 
			user = userRepo.findOne(userId);

			if (user == null) {
				throw new BadRequestException("User id not found in DB");
			}

			meeting = meetingRepo.findOne(meetingId);
			if (meeting == null) {
				throw new BadRequestException("Meeting id not found in DB");
			}

			usersInMeeting = activeMeetings.get(meetingId);
			if (usersInMeeting == null) {
				logger.error("User not in an area");
			} else {
				usersInMeeting.remove(user);
			}
			break;
		
		}

	}

	private void CheckIfAllParticipantsInMeeting(Meeting meeting, List<User> usersInMeeting) {
		int numberOfParticpants = meeting.getParticipants().size() + 1; //+1 for owner
		int activeParticipants = usersInMeeting.size();
		logger.info("Checking if all participants in Meeting, current {}, wanted {}", activeParticipants,
				numberOfParticpants);
		if (numberOfParticpants == activeParticipants) {
			// RestTemplate template = new RestTemplate();
			// HttpHeaders headers = new HttpHeaders();
			// headers.setContentType(MediaType.APPLICATION_JSON);
			// HttpEntity<String> entity = new HttpEntity<String>("parameters",
			// headers);
			//
			// template.exchange(, responseType)
			try {
				String jsonResponse;

				URL url = new URL("https://onesignal.com/api/v1/notifications");
				HttpURLConnection con = (HttpURLConnection) url.openConnection();
				con.setUseCaches(false);
				con.setDoOutput(true);
				con.setDoInput(true);
				String apiKey = properties.getApiKey();
				con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
				con.setRequestProperty("Authorization", "Basic " + apiKey);
				con.setRequestMethod("POST");

				StringBuilder buildPlayerIds = new StringBuilder();
				for (Participant participant : meeting.getParticipants()) {
					buildPlayerIds.append('"');
					buildPlayerIds.append(participant.getId());
					buildPlayerIds.append('"');
					buildPlayerIds.append(',');
				}
				buildPlayerIds.append("\"" + meeting.getOwnerId() + "\"");

				String strJsonBody = "{" + "\"app_id\": \"2e7109e7-d60a-4723-9a51-0edac1fa6e94\","
						+ "\"include_player_ids\": [" + buildPlayerIds.toString() + "]," + "\"data\": {\"id\": \""
						+ meeting.getId() + "\", \"operation\":\"4\"}," + "\"contents\": {\"en\": \"English Message\"}" + "}";

				logger.info("OneSignalRequestBody: {}", strJsonBody);

				byte[] sendBytes = strJsonBody.getBytes("UTF-8");
				con.setFixedLengthStreamingMode(sendBytes.length);

				OutputStream outputStream = con.getOutputStream();
				outputStream.write(sendBytes);

				int httpResponse = con.getResponseCode();
				logger.info("OneSignal HttpResponse: {}", httpResponse);

				if (httpResponse >= HttpURLConnection.HTTP_OK && httpResponse < HttpURLConnection.HTTP_BAD_REQUEST) {
					Scanner scanner = new Scanner(con.getInputStream(), "UTF-8");
					jsonResponse = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
					scanner.close();
				} else {
					Scanner scanner = new Scanner(con.getErrorStream(), "UTF-8");
					jsonResponse = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
					scanner.close();
				}
				logger.info("OneSignal ResponseBody:\n" + jsonResponse);

			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	}

}
