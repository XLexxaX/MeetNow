/**
 * MeetNow Internal Communication API
 * This is the API for internal communication between the MeetNow app on mobile devices and the backend
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from './models';

export interface Meeting {
    /**
     * unique identifier
     */
    id?: string;

    /**
     * meeting name
     */
    name?: string;

    ownerId: string;

    /**
     * how often shall the meeting reoccur?
     */
    reoccurrence: Meeting.ReoccurrenceEnum;

    /**
     * meeting category
     */
    category?: Meeting.CategoryEnum;

    participants?: Array<models.MeetingParticipants>;

    groups?: Array<models.MeetingGroups>;

    nextScheduled?: Date;

    areas?: Array<models.MeetingAreas>;

}
export namespace Meeting {
    export enum ReoccurrenceEnum {
        Daily = <any> 'daily',
        Weekly = <any> 'weekly',
        Monthly = <any> 'monthly'
    }
    export enum CategoryEnum {
        Jourfix = <any> 'jourfix',
        Coffeebreak = <any> 'coffeebreak',
        Meeting = <any> 'meeting'
    }
}
