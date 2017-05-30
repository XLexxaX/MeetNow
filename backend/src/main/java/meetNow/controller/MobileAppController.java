package meetNow.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MobileAppController {

	@RequestMapping("/test")
    public String greeting() {
        return "OK";
    }

}