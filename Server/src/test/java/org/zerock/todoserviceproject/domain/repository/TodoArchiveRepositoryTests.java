package org.zerock.todoserviceproject.domain.repository;


import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zerock.todoserviceproject.domain.repository.todoArchive.TodoArchiveRepository;


@SpringBootTest
@Log4j2
public class TodoArchiveRepositoryTests {

    @Autowired
    private TodoArchiveRepository todoArchiveRepository;


    @Test
    public void TodoArchiveRepositoryTestCleanUpExpiredTarget() {
        log.info(todoArchiveRepository.findRemoveExpiredTargets("cpst").size());
    }
}
