package org.zerock.todoserviceproject.application.dto.todo.projection.response;

import lombok.*;


@Data
@Builder
@Getter
@AllArgsConstructor
public class ResponseRegisterTodoDTO {
    private Long tno;
    private String writer;
    private String execution;
    private String status;
}
