package org.zerock.todoserviceproject.application.dto.todo.projection.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RequestRemoveTodoDTO {
    @NotNull private Long tno;
    @NotNull private String writer;
    @NotNull private Integer delta;
}
