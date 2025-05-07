package org.zerock.todoserviceproject.application.dto.todo.map;


import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.zerock.todoserviceproject.application.dto.todo.TodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.archive.TodoArchiveDTO;
import org.zerock.todoserviceproject.domain.entity.TodoEntity;
import org.zerock.todoserviceproject.domain.entity.archive.TodoArchiveEntity;

@Component
@RequiredArgsConstructor
public class ProjectionMapper {

    private final ModelMapper modelMapper;

    public TodoDTO mapToDTO(TodoEntity todoEntity) {
        return this.modelMapper.map(todoEntity, TodoDTO.class);
    }

    public TodoArchiveDTO mapToDTO(TodoArchiveEntity archiveTodoEntity) {
        return this.modelMapper.map(archiveTodoEntity, TodoArchiveDTO.class);
    }

    public TodoEntity mapToEntity(TodoDTO todoDTO) {
        return this.modelMapper.map(todoDTO, TodoEntity.class);
    }

    public TodoArchiveEntity mapToEntity(TodoArchiveDTO archiveTodoDTO) {
        return this.modelMapper.map(archiveTodoDTO, TodoArchiveEntity.class);
    }

    public TodoArchiveDTO convertToTodoArchiveDTO(TodoDTO targetTodoDTO, Integer delta) {

        return TodoArchiveDTO.builder()
                .tno(targetTodoDTO.getTno())
                .writer(targetTodoDTO.getWriter())
                .title(targetTodoDTO.getTitle())
                .date(targetTodoDTO.getDate())
                .from(targetTodoDTO.getFrom())
                .to(targetTodoDTO.getTo())
                .complete(targetTodoDTO.isComplete())
                .delta(delta)
                .build();
    }


    public TodoDTO convertToTodoDTO(TodoArchiveDTO targetTodoArchiveDTO) {

        return TodoDTO.builder()
                .writer(targetTodoArchiveDTO.getWriter())
                .title(targetTodoArchiveDTO.getTitle())
                .date(targetTodoArchiveDTO.getDate())
                .from(targetTodoArchiveDTO.getFrom())
                .to(targetTodoArchiveDTO.getTo())
                .complete(targetTodoArchiveDTO.isComplete())
                .build();
    }
}
