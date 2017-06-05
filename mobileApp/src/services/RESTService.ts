import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

/**
 * This is just a test class for testing the Backend-API;
 * the actual API can be found in src/gen;
 * However, the API should be called by one of the Services
 * from the /services-folder. Here, further functionalities,
 * like local storage methods are implemented.
 * */
export class RESTService {

  apiUrl: string;


  static get parameters() {
    return [[Http]];
  }

  constructor(private http:Http) {
    this.apiUrl = 'http://localhost:8080/meeting';
  }

  get(param) {

    var headers = new Headers();
    headers.append('Content-Type', 'application/json' );
    let options = new RequestOptions({ headers: headers });

    let postParams = {
      "ownerId": 1,
      "reoccurrence": "daily",
      "participants": [
        {
          "id": "1",
          "busyTimes": [
            {
              "startTime": "10:12",
              "duration": "0:45"
            }
          ]
        }
      ]
    };

    var resp = this.http.post("http://localhost:8080/meeting", postParams, options).subscribe(data => {
      console.log(data.json())
    });
    console.log(resp);

    return "xx";
  }

  handleError(error) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
