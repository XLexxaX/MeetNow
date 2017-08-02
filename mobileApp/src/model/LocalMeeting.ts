import {Meeting} from "../gen/model/Meeting";


export interface LocalMeeting {

  meeting: Meeting;
  calendarId?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}
