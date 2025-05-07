package org.zerock.todoserviceproject.domain.repository.todo.extension.remove;

import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRemoveTodoDTO;
import org.zerock.todoserviceproject.domain.entity.TodoEntity;

public interface TodoRepositoryRemoveExtension {

    TodoEntity findRemoveTarget(RequestRemoveTodoDTO requestRemoveTodoDTO);
}
