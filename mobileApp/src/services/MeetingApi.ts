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

import { Inject, Injectable, Optional }                      from '@angular/core';
import { Http, Headers, URLSearchParams }                    from '@angular/http';
import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Response, ResponseContentType }                     from '@angular/http';

import { Observable }                                        from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as models                                           from '../gen/model/models';
import { BASE_PATH, COLLECTION_FORMATS }                     from '../gen/variables';
import { Configuration }                                     from '../gen/configuration';

/* tslint:disable:no-unused-variable member-ordering */


@Injectable()
export class MeetingApi {

    protected basePath = 'https://meetnow.cfapps.eu10.hana.ondemand.com';
    public defaultHeaders: Headers = new Headers();
    public configuration: Configuration = new Configuration();

    constructor(protected http: Http, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
        }
    }

    /**
     * Submit a new meeting to the backends
     *
     * @param meeting Meeting that needs to be submitted to the backend
     */
    public addMeeting(meeting: models.Meeting, extraHttpRequestParams?: any): Observable<string> {
        return this.addMeetingWithHttpInfo(meeting, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }

    /**
     * Remove an existing meeting
     *
     * @param meeting Meeting which shall be deleted
     */
    public removeMeeting(meeting: models.Meeting, extraHttpRequestParams?: any): Observable<{}> {
        return this.removeMeetingWithHttpInfo(meeting, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                  return response.status;
                }
            });
    }

    /**
     * Update an existing meeting
     *
     * @param meeting Meeting which shall be updated
     */
    public updateMeeting(meeting: models.Meeting, extraHttpRequestParams?: any): Observable<{}> {
        return this.updateMeetingWithHttpInfo(meeting, extraHttpRequestParams)
            .map((response: Response) => {
                if (response.status === 204) {
                    return undefined;
                } else {
                    return response.json();
                }
            });
    }


    /**
     * Submit a new meeting to the backends
     *
     * @param meeting Meeting that needs to be submitted to the backend
     */
    public addMeetingWithHttpInfo(meeting: models.Meeting, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/meeting`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'meeting' is not null or undefined
        if (meeting === null || meeting === undefined) {
            throw new Error('Required parameter meeting was null or undefined when calling addMeeting.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
            'text/plain'
        ];

        headers.set('Content-Type', 'application/json');

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Post,
            headers: headers,
            body: meeting == null ? '' : JSON.stringify(meeting), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Remove an existing meeting
     *
     * @param meeting Meeting which shall be deleted
     */
    public removeMeetingWithHttpInfo(meeting: models.Meeting, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/meeting`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'meeting' is not null or undefined
        if (meeting === null || meeting === undefined) {
            throw new Error('Required parameter meeting was null or undefined when calling removeMeeting.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
        ];

        headers.set('Content-Type', 'application/json');

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Delete,
            headers: headers,
            body: meeting == null ? '' : JSON.stringify(meeting), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }

    /**
     * Update an existing meeting
     *
     * @param meeting Meeting which shall be updated
     */
    public updateMeetingWithHttpInfo(meeting: models.Meeting, extraHttpRequestParams?: any): Observable<Response> {
        const path = this.basePath + `/meeting`;

        let queryParameters = new URLSearchParams();
        let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
        // verify required parameter 'meeting' is not null or undefined
        if (meeting === null || meeting === undefined) {
            throw new Error('Required parameter meeting was null or undefined when calling updateMeeting.');
        }
        // to determine the Content-Type header
        let consumes: string[] = [
            'application/json'
        ];

        // to determine the Accept header
        let produces: string[] = [
        ];

        headers.set('Content-Type', 'application/json');

        let requestOptions: RequestOptionsArgs = new RequestOptions({
            method: RequestMethod.Put,
            headers: headers,
            body: meeting == null ? '' : JSON.stringify(meeting), // https://github.com/angular/angular/issues/10612
            search: queryParameters
        });

        // https://github.com/swagger-api/swagger-codegen/issues/4037
        if (extraHttpRequestParams) {
            requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
        }

        return this.http.request(path, requestOptions);
    }


  /**
   * notify the backend that the client enters a defined area
   *
   * @param meetingId the id of the meeting which has an area which was entered
   * @param userId the (OneSignal) id of the user
   */
  public enterArea(meetingId: string, userId: string, extraHttpRequestParams?: any): Observable<{}> {
    return this.enterAreaWithHttpInfo(meetingId, userId, extraHttpRequestParams)
      .map((response: Response) => {
        if (response.status === 204) {
          return undefined;
        } else {
          return undefined;
        }
      });
  }

  /**
   * notify the backend that the client leaves a defined area
   *
   * @param meetingId the id of the meeting which area was left
   * @param userId the (OneSignal) id of the user
   */
  public leaveArea(meetingId: string, userId: string, extraHttpRequestParams?: any): Observable<{}> {
    return this.leaveAreaWithHttpInfo(meetingId, userId, extraHttpRequestParams)
      .map((response: Response) => {
        if (response.status === 204) {
          return undefined;
        } else {
          return undefined;
        }
      });
  }


  /**
   * notify the backend that the client enters a defined area
   *
   * @param meetingId the id of the meeting which has an area which was entered
   * @param userId the (OneSignal) id of the user
   */
  public enterAreaWithHttpInfo(meetingId: string, userId: string, extraHttpRequestParams?: any): Observable<Response> {
    const path = this.basePath + `/enterArea`;

    let queryParameters = new URLSearchParams();
    let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
    let formParams = new URLSearchParams();

    // verify required parameter 'meetingId' is not null or undefined
    if (meetingId === null || meetingId === undefined) {
      throw new Error('Required parameter meetingId was null or undefined when calling enterArea.');
    }
    // verify required parameter 'userId' is not null or undefined
    if (userId === null || userId === undefined) {
      throw new Error('Required parameter userId was null or undefined when calling enterArea.');
    }
    // to determine the Content-Type header
    let consumes: string[] = [
      'application/x-www-form-urlencoded'
    ];

    // to determine the Accept header
    let produces: string[] = [
      'application/json'
    ];

    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    if (meetingId !== undefined) {
      formParams.set('meetingId', <any>meetingId);
    }

    if (userId !== undefined) {
      formParams.set('userId', <any>userId);
    }

    let requestOptions: RequestOptionsArgs = new RequestOptions({
      method: RequestMethod.Post,
      headers: headers,
      body: formParams.toString(),
      search: queryParameters
    });

    // https://github.com/swagger-api/swagger-codegen/issues/4037
    if (extraHttpRequestParams) {
      requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
    }

    return this.http.request(path, requestOptions);
  }

  /**
   * notify the backend that the client leaves a defined area
   *
   * @param meetingId the id of the meeting which area was left
   * @param userId the (OneSignal) id of the user
   */
  public leaveAreaWithHttpInfo(meetingId: string, userId: string, extraHttpRequestParams?: any): Observable<Response> {
    const path = this.basePath + `/leaveArea`;

    let queryParameters = new URLSearchParams();
    let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
    let formParams = new URLSearchParams();

    // verify required parameter 'meetingId' is not null or undefined
    if (meetingId === null || meetingId === undefined) {
      throw new Error('Required parameter meetingId was null or undefined when calling leaveArea.');
    }
    // verify required parameter 'userId' is not null or undefined
    if (userId === null || userId === undefined) {
      throw new Error('Required parameter userId was null or undefined when calling leaveArea.');
    }
    // to determine the Content-Type header
    let consumes: string[] = [
      'application/x-www-form-urlencoded'
    ];

    // to determine the Accept header
    let produces: string[] = [
      'application/json'
    ];

    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    if (meetingId !== undefined) {
      formParams.set('meetingId', <any>meetingId);
    }

    if (userId !== undefined) {
      formParams.set('userId', <any>userId);
    }

    let requestOptions: RequestOptionsArgs = new RequestOptions({
      method: RequestMethod.Post,
      headers: headers,
      body: formParams.toString(),
      search: queryParameters
    });

    // https://github.com/swagger-api/swagger-codegen/issues/4037
    if (extraHttpRequestParams) {
      requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
    }

    return this.http.request(path, requestOptions);
  }


  public newUser(pushId: string, extraHttpRequestParams?: any): Observable<models.User> {
    return this.newUserWithHttpInfo(pushId, extraHttpRequestParams)
      .map((response: Response) => {
        if (response.status === 204) {
          return undefined;
        } else {
          return response.json();
        }
      });
  }


  /**
   * make urself known to the backend
   *
   * @param pushId the oneSignal push id
   */
  public newUserWithHttpInfo(pushId: string, extraHttpRequestParams?: any): Observable<Response> {
    const path = this.basePath + `/newUser`;

    let queryParameters = new URLSearchParams();
    let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845
    let formParams = new URLSearchParams();

    // verify required parameter 'pushId' is not null or undefined
    if (pushId === null || pushId === undefined) {
      throw new Error('Required parameter pushId was null or undefined when calling newUser.');
    }
    // to determine the Content-Type header
    let consumes: string[] = [
      'application/x-www-form-urlencoded'
    ];

    // to determine the Accept header
    let produces: string[] = [
      'application/json'
    ];

    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    if (pushId !== undefined) {
      formParams.set('pushId', <any>pushId);
    }

    let requestOptions: RequestOptionsArgs = new RequestOptions({
      method: RequestMethod.Post,
      headers: headers,
      body: formParams.toString(),
      search: queryParameters
    });

    // https://github.com/swagger-api/swagger-codegen/issues/4037
    if (extraHttpRequestParams) {
      requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
    }

    return this.http.request(path, requestOptions);
  }


}
