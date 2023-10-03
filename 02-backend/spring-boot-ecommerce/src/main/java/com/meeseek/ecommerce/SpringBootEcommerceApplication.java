package com.meeseek.ecommerce;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Ecommerce API docs", version = "1.0.0"))
public class SpringBootEcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootEcommerceApplication.class, args);

//		System.out.println("version: " + SpringVersion.getVersion());
    }

}
