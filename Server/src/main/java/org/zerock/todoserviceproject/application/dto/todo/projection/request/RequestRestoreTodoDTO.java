package org.zerock.todoserviceproject.application.dto.todo.projection.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestRestoreTodoDTO {
    @NotNull
    private Long tno;

    @NotNull
    @NotEmpty
    private String writer;
}