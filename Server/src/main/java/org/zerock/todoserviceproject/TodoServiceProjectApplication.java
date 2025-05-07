package org.zerock.todoserviceproject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing
public class TodoServiceProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(TodoServiceProjectApplication.class, args);
    }

}
