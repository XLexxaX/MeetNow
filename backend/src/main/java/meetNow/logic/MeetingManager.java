package meetNow.logic;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

import swagger.model.Meeting;

@Component
@RequestScope
public class MeetingManager implements MeetingProcessor {
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
//	@Autowired
//	private CustomerRepository repository;

	@Override
	public String processNewMeeting(Meeting meeting) {
//		Customer customer = repository.save(new Customer("Carmen", "Rannefeld"));
//		logger.info("Added new Customer: {}", customer);
//		Customer testCustomer = repository.findOne(customer.id);
//		logger.info("Found {}", testCustomer);
		logger.info("processing Meeting {}", meeting);
		return "A43232";
	}

		@Override
	public boolean updateMeeting(Meeting meeting) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean deleteMeeting(Meeting meeting) {
		// TODO Auto-generated method stub
		return false;
	}

}
