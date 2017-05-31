package meetNow.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import api.api.EnterAreaApi;

@RestController
public class MobileAppController implements EnterAreaApi {

	@RequestMapping("/test")
	public String greeting(String test) {
		return "OK";
	}

	@Override
	public ResponseEntity<Void> enterArea(Integer areaId) {
		return new ResponseEntity<>(HttpStatus.OK);
	}

}