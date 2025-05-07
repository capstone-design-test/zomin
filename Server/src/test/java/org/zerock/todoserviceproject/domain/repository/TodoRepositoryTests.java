package org.zerock.todoserviceproject.domain.repository;


import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.zerock.todoserviceproject.application.dto.todo.TodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.map.ProjectionMapper;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestQueryTodoDTO;
import org.zerock.todoserviceproject.domain.entity.TodoEntity;
import org.zerock.todoserviceproject.domain.repository.todo.TodoRepository;

import java.text.MessageFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.IntStream;

@SpringBootTest
@Log4j2
public class TodoRepositoryTests {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private ProjectionMapper projectionMapper;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Test
    public void TodoRepositoryTestInsert() {
        LocalDateTime from = convertToEntityAttribute("2025-04-18 18:00");
        LocalDateTime to = convertToEntityAttribute("2025-04-19 11:00");
        
        IntStream.rangeClosed(1, 40).forEach(i -> {

            TodoEntity todo = TodoEntity.builder()
                    .writer("JKB")
                    .title(MessageFormat.format("Dummy JKB title - {0}", (i % 30) + 1 ))
                    .date(LocalDate.of(2025, (i % 8) + 4, (i % 30) + 1 ))
                    .from(from)
                    .to(to)
                    .build();

            todoRepository.save(todo);
        });


        IntStream.rangeClosed(1, 30).forEach(i -> {

            TodoEntity todo = TodoEntity.builder()
                    .writer("cpst")
                    .title(MessageFormat.format("Dummy Cpst title - {0}", (i % 30) + 1 ))
                    .date(LocalDate.of(2025, (i % 8) + 4, (i % 30) + 1 ))
                    .from(from)
                    .to(to)
                    .build();

            todoRepository.save(todo);
        });

        IntStream.rangeClosed(1, 45).forEach(i -> {

            TodoEntity todo = TodoEntity.builder()
                    .writer("man")
                    .title(MessageFormat.format("Dummy Man title - {0}", (i % 30) + 1 ))
                    .date(LocalDate.of(2025, (i % 8) + 4, (i % 30) + 1 ))
                    .from(from)
                    .to(to)
                    .build();

            todoRepository.save(todo);
        });


        IntStream.rangeClosed(1, 61).forEach(i -> {

            TodoEntity todo = TodoEntity.builder()
                    .writer("Spy99")
                    .title(MessageFormat.format("Dummy 99spo title - {0}", (i % 30) + 1 ))
                    .date(LocalDate.of(2025, (i % 8) + 4, (i % 30) + 1 ))
                    .from(from)
                    .to(to)
                    .build();

            todoRepository.save(todo);
        });

    }


    @Test
    public void TodoRepositoryTestQuery() {
        RequestQueryTodoDTO requestQueryTodoDTO = RequestQueryTodoDTO.builder()
                .writer("JKB").date(LocalDate.of(2025, 4, 20)).build();

        List<TodoEntity> list =  todoRepository.findListByDate(requestQueryTodoDTO);

        list.forEach(entity -> log.info(projectionMapper.mapToDTO(entity)));

        log.info("=======================================================================");

        RequestQueryTodoDTO requestQueryTodoDTO2 = RequestQueryTodoDTO.builder()
                .writer("man").date(LocalDate.of(2025, 4, 20)).build();

        List<TodoEntity> list2 =  todoRepository.findListByDate(requestQueryTodoDTO2);

        list2.forEach(entity -> log.info(projectionMapper.mapToDTO(entity)));
    }

    public String convertToDatabaseColumn(LocalDateTime attribute) {
        return (attribute != null) ? attribute.format(FORMATTER) : null;
    }

    public LocalDateTime convertToEntityAttribute(String dbData) {
        return (dbData != null) ? LocalDateTime.parse(dbData, FORMATTER) : null;
    }


    @Test
    public void TodoRepositoryTestMonthlyQuery() {
        RequestQueryTodoDTO requestQueryTodoDTO = RequestQueryTodoDTO.builder()
                .writer("andantan").date(LocalDate.of(2025, 5, 31)).build();

        LocalDateTime startOfMonth = LocalDateTime.of(
                requestQueryTodoDTO.getDate().getYear(),
                requestQueryTodoDTO.getDate().getMonth(),
                1, 0, 0, 0
        );

        LocalDateTime endOfMonth = requestQueryTodoDTO.getDate().atTime(23, 59);

        log.info("start: {}, end: {}", startOfMonth, endOfMonth);

        List<TodoEntity> list = todoRepository.findMonthlyListByDate(requestQueryTodoDTO);
        log.info(list);

        list.forEach(entity -> log.info(projectionMapper.mapToDTO(entity)));
    }
}
