package com.meeseek.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{

        // protect endpoint /api/orders
        http.authorizeHttpRequests(configurer ->
                            configurer
                                    .antMatchers("/api/orders/**")
                                    .authenticated())
                .oauth2ResourceServer()
                .jwt();

        // add CORS filters
        http.cors();

        // add content negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class,
                             new HeaderContentNegotiationStrategy());

        // for a non-empty reponse body for 401
        // 來自 okta spring security
        Okta.configureResourceServer401ResponseBody(http);

        // 取消 CSRF - 預設是開啟的
        // 因為 app 沒有使用 cookie 做 session tracking
        http.csrf().disable();

        return http.build();
    }
}
