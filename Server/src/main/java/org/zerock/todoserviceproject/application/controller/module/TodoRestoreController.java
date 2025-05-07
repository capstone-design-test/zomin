package org.zerock.todoserviceproject.application.controller.module;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.todoserviceproject.application.controller.AbstractTodoController;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRestoreTodoDTO;
import org.zerock.todoserviceproject.domain.service.module.restore.TodoRestoreService;

import java.util.Map;

@RestController
@Log4j2
@RequiredArgsConstructor
public class TodoRestoreController extends AbstractTodoController {

    private final TodoRestoreService todoRestoreService;

    @Operation(
            summary = "Todo 복원",
            description = "RequestRestoreTodoDTO 형식 참조"
    )
    @PutMapping(
            value = "/restore",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public Map<String, String> restore(
            @Valid @RequestBody RequestRestoreTodoDTO requestRestoreTodoDTO,
            BindingResult requestBindingResult
    ) throws BindException {

        if (requestBindingResult.hasErrors()) {
            throw new BindException(requestBindingResult);
        }

        return todoRestoreService.requestRestore(requestRestoreTodoDTO);
    }
}
