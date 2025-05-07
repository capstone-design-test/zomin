package org.zerock.todoserviceproject.domain.service;


import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zerock.todoserviceproject.domain.service.module.query.TodoQueryService;

@SpringBootTest
@Log4j2
public class TodoServiceTests {

    @Autowired
    private TodoQueryService todoQueryService;


    @Test
    public void todoServiceTestQueryById() {

    }
}
