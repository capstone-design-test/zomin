package org.zerock.todoserviceproject.application.dto.todo.projection.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseQueryTodoDTO {
    private Long tno;

    private String writer;

    private String title;

    private LocalDate date;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDateTime from;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDateTime to;

    private boolean complete;
}
