package org.zerock.todoserviceproject.domain.service.module.modify;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.zerock.todoserviceproject.application.dto.todo.TodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.map.ProjectionMapper;
import org.zerock.todoserviceproject.application.dto.todo.map.ResponseMapper;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestModifyTodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.projection.response.ResponseModifyTodoDTO;
import org.zerock.todoserviceproject.domain.entity.TodoEntity;
import org.zerock.todoserviceproject.domain.repository.todo.TodoRepository;

import java.util.Map;
import java.util.NoSuchElementException;

@Service
@Log4j2
@RequiredArgsConstructor
public class TodoModifyServiceImpl implements TodoModifyService {

    private final TodoRepository todoRepository;
    private final ResponseMapper responseMapper;
    private final ProjectionMapper projectionMapper;

    @Override
    public Map<String, String> requestModify(RequestModifyTodoDTO requestModifyTodoDTO) {
        TodoDTO targetTodoDTO = this.todoRepository.findById(requestModifyTodoDTO.getTno())   // Query
                .map(projectionMapper::mapToDTO)  // If exist then mapping
                .orElseThrow(() -> new NoSuchElementException("Todo tuple not found: " + requestModifyTodoDTO.getTno())); // else throw exception

        if (requestModifyTodoDTO.getTitle() != null) {
            targetTodoDTO.changeTitle(requestModifyTodoDTO.getTitle());
        }

        if (requestModifyTodoDTO.getDate() != null) {
            targetTodoDTO.changeDate(requestModifyTodoDTO.getDate());
        }

        if (requestModifyTodoDTO.getFrom() != null) {
            targetTodoDTO.changeFrom(requestModifyTodoDTO.getFrom());
        }

        if (requestModifyTodoDTO.getTo() != null) {
            targetTodoDTO.changeTo(requestModifyTodoDTO.getTo());
        }

        targetTodoDTO.changeComplete(requestModifyTodoDTO.isComplete());


        TodoEntity resultEntity = this.todoRepository.save(
                this.projectionMapper.mapToEntity(targetTodoDTO)
        );

        ResponseModifyTodoDTO responseModifyTodoDTO = this.responseMapper.mapToModifyResponseTodoDTO(
                this.projectionMapper.mapToDTO(resultEntity)
        );

        return this.responseMapper.getResponseMap(responseModifyTodoDTO);
    }
}
