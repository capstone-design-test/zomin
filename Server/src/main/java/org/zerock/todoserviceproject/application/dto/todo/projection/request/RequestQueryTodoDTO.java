package org.zerock.todoserviceproject.application.dto.todo.projection.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
public class RequestQueryTodoDTO {
    private String writer;
    private LocalDate date;
}
