import {Meeting} from "../gen/model/Meeting";


export interface LocalMeeting {

  meeting: Meeting;
  calendarId?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
}
