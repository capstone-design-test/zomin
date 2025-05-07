package org.zerock.todoserviceproject.domain.service.module.register;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.zerock.todoserviceproject.application.dto.todo.TodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.map.ProjectionMapper;
import org.zerock.todoserviceproject.application.dto.todo.map.RequestMapper;
import org.zerock.todoserviceproject.application.dto.todo.map.ResponseMapper;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRegisterTodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.projection.response.ResponseRegisterTodoDTO;
import org.zerock.todoserviceproject.domain.entity.TodoEntity;
import org.zerock.todoserviceproject.domain.repository.todo.TodoRepository;

import java.util.Map;


@Service
@Log4j2
@RequiredArgsConstructor
public class TodoRegisterServiceImpl implements TodoRegisterService {

    private final TodoRepository todoRepository;
    private final ProjectionMapper projectionMapper;
    private final ResponseMapper responseMapper;
    private final RequestMapper requestMapper;


    @Override
    public Map<String, String> requestRegister(RequestRegisterTodoDTO requestRegisterTodoDTO) {
        TodoDTO registerTodoDTO = this.requestMapper.mapToTodoDTO(requestRegisterTodoDTO);

        TodoEntity result = this.todoRepository.save(this.projectionMapper.mapToEntity(registerTodoDTO));

        ResponseRegisterTodoDTO responseRegisterTodoDTO = this.responseMapper
                .mapToRegisterResponseTodoDTO(registerTodoDTO);

        responseRegisterTodoDTO.setTno(result.getTno());

        return responseMapper.getResponseMap(responseRegisterTodoDTO);
    }
}
