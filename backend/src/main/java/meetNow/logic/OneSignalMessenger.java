package meetNow.logic;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import meetNow.configuration.ApiProperties;
import swagger.model.Meeting;
import swagger.model.Participant;

@Component
public class OneSignalMessenger implements PushServiceMessenger {

	@Autowired
	private ApiProperties properties;

	private ExecutorService executor = Executors.newSingleThreadExecutor();
	private Logger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void postNotification(String message, Meeting meeting, int operationId) {
		//create a new request with specified message, meeting and operationId
		Callable<Void> request = new OneSignalRequest(message, meeting, operationId);
		executor.submit(request); //start of the API call
	}

	private class OneSignalRequest implements Callable<Void> {

		private String message;
		private Meeting meeting;
		private int operationId;

		public OneSignalRequest(String message, Meeting meeting, int operationId) {
			this.message = message;
			this.meeting = meeting;
			this.operationId = operationId;
		}

		@Override
		public Void call() throws Exception {
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
						+ meeting.getId() + "\", \"operation\":\"" + operationId + "\"}," + "\"contents\": {\"en\": \""
						+ message + "\"}" + "}";

				logger.info("OneSignalRequestBody: {}", strJsonBody);

				byte[] sendBytes = strJsonBody.getBytes("UTF-8");
				con.setFixedLengthStreamingMode(sendBytes.length);

				OutputStream outputStream = con.getOutputStream();
				outputStream.write(sendBytes);

				int httpResponse = con.getResponseCode();
				logger.info("OneSignal HttpResponseCode: {}", httpResponse);

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

			return null;
		}

	}

}
