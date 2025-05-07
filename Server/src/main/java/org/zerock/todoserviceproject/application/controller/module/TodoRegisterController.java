package org.zerock.todoserviceproject.application.controller.module;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.zerock.todoserviceproject.application.controller.AbstractTodoController;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRegisterTodoDTO;
import org.zerock.todoserviceproject.domain.service.module.register.TodoRegisterService;

import java.util.Map;


@RestController
@Log4j2
@RequiredArgsConstructor
public class TodoRegisterController extends AbstractTodoController {

    private final TodoRegisterService todoRegisterService;


    @Operation(
            summary = "Todo 등록",
            description = "RequestRegisterTodoDTO 형식 참조"
    )
    @PostMapping(
            value = "/register",
            consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public Map<String, String> register(
            @Valid @RequestBody RequestRegisterTodoDTO requestRegisterTodoDTO,
            BindingResult requestBindingResult
    ) throws BindException {

        if (requestBindingResult.hasErrors()) {
            throw new BindException(requestBindingResult);
        }

        return this.todoRegisterService.requestRegister(requestRegisterTodoDTO);
    }

}
