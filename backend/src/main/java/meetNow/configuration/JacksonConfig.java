package meetNow.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.joda.JodaModule;

@Configuration
public class JacksonConfig {
	
	
	@Bean
	public ObjectMapper jsonMapper() {
	    ObjectMapper objectMapper = new ObjectMapper();

	    objectMapper.configure(com.fasterxml.jackson.databind.SerializationFeature.
	        WRITE_DATES_AS_TIMESTAMPS , false);
	    objectMapper.registerModule(new JodaModule());
	    return objectMapper;
	}

}
