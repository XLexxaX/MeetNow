package meetNow.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:config.properties")
public class ApiProperties {

    @Autowired
    private Environment env;

    public String getApiKey() {
        return env.getProperty("APIKey");
    }

}
