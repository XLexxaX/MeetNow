package meetNow.dataaccess.repositories;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.fail;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import meetNow.logic.MeetingManager;
import meetNow.logic.MeetingNotFoundException;
import meetNow.logic.MeetingProcessor;
import swagger.model.Meeting;
import swagger.model.Meeting.CategoryEnum;
import swagger.model.Meeting.ReoccurrenceEnum;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = { TestAppConfig.class, MeetingManager.class })
public class MeetingManagerTest {

	private static final String SOME_MEETING_NAME = "my meeting name";
	private static final String SOME_OTHER_ID = "This id will never be in use by mongo";
	private static final CategoryEnum SOME_CATEGORY = CategoryEnum.values()[0];
	private static final CategoryEnum SOME_OTHER_CATEGORY = CategoryEnum.values()[1];
	private static final ReoccurrenceEnum SOME_REOCCURRENCE = ReoccurrenceEnum.values()[0];

	@Autowired
	private MeetingRepository repository;

	@Autowired
	private MeetingProcessor manager;

	@Before
	public void setUp() throws Exception {
		repository.deleteAll();
	}

	@Test
	public void testSaveMeeting() {
		Meeting meeting = createNewMeeting();
		repository.save(meeting);
		assertThat(repository.count()).isEqualTo(1);
		Meeting savedMeeting = repository.findAll().get(0);
		assertThat(meeting).isEqualTo(savedMeeting);
	}

	@Test
	public void testUpdateMeetingWhenMeetingExists() throws Exception {
		Meeting meeting = createNewMeeting();
		repository.save(meeting);
		String oldMeetingId = meeting.getId() + "";
		meeting.setCategory(SOME_OTHER_CATEGORY);
		manager.updateMeeting(meeting);
		meeting = repository.findOne(meeting.getId());
		assertThat(meeting.getCategory()).isEqualTo(SOME_OTHER_CATEGORY);
		assertThat(meeting.getId()).isEqualTo(oldMeetingId);
		assertThat(repository.count()).isEqualTo(1);
	}

	@Test
	public void testUpdateMeetingWhenNoMatchingMeetingExists() {
		Meeting meeting = createNewMeeting();
		repository.save(meeting);
		Meeting otherMeeting = createNewMeeting();
		otherMeeting.setId(SOME_OTHER_ID);
		try {
			manager.updateMeeting(otherMeeting);
			fail("Exception not thrown");
		} catch (MeetingNotFoundException e) {
			Meeting savedMeeting = repository.findOne(meeting.getId());
			assertThat(savedMeeting.getId()).isNotEqualTo(otherMeeting.getId());
		}
	}

	@Test
	public void testDeleteMeetingWhenMeetingExists() throws Exception {
		Meeting meeting = createNewMeeting();
		repository.save(meeting);
		manager.deleteMeeting(meeting);
		assertThat(repository.count()).isEqualTo(0);
	}

	@Test
	public void testDeleteMeetingWhenMeetingNotExists() {
		Meeting meeting = createNewMeeting();
		repository.save(meeting);
		Meeting otherMeeting = createNewMeeting();
		otherMeeting.setId(SOME_OTHER_ID);
		try {
			manager.deleteMeeting(otherMeeting);
			fail("Exception not thrown");
		} catch (MeetingNotFoundException e) {
			assertThat(repository.count()).isEqualTo(1);
		}
	}

	private Meeting createNewMeeting() {
		Meeting meeting = new Meeting();
		meeting.setName(SOME_MEETING_NAME);
		meeting.setCategory(SOME_CATEGORY);
		meeting.setReoccurrence(SOME_REOCCURRENCE);
		return meeting;
	}

}
