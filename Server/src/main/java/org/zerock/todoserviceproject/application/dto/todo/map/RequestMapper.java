package org.zerock.todoserviceproject.application.dto.todo.map;


import org.springframework.stereotype.Component;
import org.zerock.todoserviceproject.application.dto.todo.TodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRegisterTodoDTO;

@Component
public class RequestMapper {

    public TodoDTO mapToTodoDTO(RequestRegisterTodoDTO requestRegisterTodoDTO) {
        return TodoDTO.builder()
                .writer(requestRegisterTodoDTO.getWriter())
                .title(requestRegisterTodoDTO.getTitle())
                .date(requestRegisterTodoDTO.getDate())
                .from(requestRegisterTodoDTO.getFrom())
                .to(requestRegisterTodoDTO.getTo())
                .complete(requestRegisterTodoDTO.getComplete())
                .build();
    }



}
