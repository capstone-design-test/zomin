package org.zerock.todoserviceproject.domain.service.module.restore;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.zerock.todoserviceproject.application.dto.todo.TodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.archive.TodoArchiveDTO;
import org.zerock.todoserviceproject.application.dto.todo.map.ProjectionMapper;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRestoreTodoDTO;
import org.zerock.todoserviceproject.domain.entity.archive.TodoArchiveEntity;
import org.zerock.todoserviceproject.domain.repository.todo.TodoRepository;
import org.zerock.todoserviceproject.domain.repository.todoArchive.TodoArchiveRepository;

import java.util.Map;


@Service
@Log4j2
@RequiredArgsConstructor
public class TodoRestoreServiceImpl implements TodoRestoreService {

    private final TodoRepository todoRepository;
    private final TodoArchiveRepository archiveTodoRepository;
    private final ProjectionMapper projectionMapper;

    @Override
    public Map<String, String> requestRestore(RequestRestoreTodoDTO requestRestoreTodoDTO) {

        TodoArchiveDTO archiveTargetTodoDTO = this.projectionMapper.mapToDTO(
                this.retriveTupleAndRemove(requestRestoreTodoDTO)
        );

        TodoDTO todoDTO = this.projectionMapper.convertToTodoDTO(archiveTargetTodoDTO);

        this.todoRepository.save(
                this.projectionMapper.mapToEntity(todoDTO)
        );

        return Map.of(
                "status", "success",
                "execution", "restore",
                "tno", requestRestoreTodoDTO.getTno().toString(),
                "writer", requestRestoreTodoDTO.getWriter()
        );
    }

    private TodoArchiveEntity retriveTupleAndRemove(RequestRestoreTodoDTO RequestRestoreTodoDTO) {
        TodoArchiveEntity targetEntity = this.archiveTodoRepository.findRestoreTarget(RequestRestoreTodoDTO);

        log.info("Target entity: {}", targetEntity);

        this.archiveTodoRepository.deleteById(RequestRestoreTodoDTO.getTno());

        return targetEntity;
    }
}
