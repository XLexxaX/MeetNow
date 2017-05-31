import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

export class RESTService {

  apiUrl: string;


  static get parameters() {
    return [[Http]];
  }

  constructor(private http:Http) {
    this.apiUrl = 'http://api.themoviedb.org/3/search/movie?query=&query=';
  }

  get(param) {
    var url = this.apiUrl + encodeURI(param) + '&api_key=5fbddf6b517048e25bc3ac1bbeafb919';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }
}
