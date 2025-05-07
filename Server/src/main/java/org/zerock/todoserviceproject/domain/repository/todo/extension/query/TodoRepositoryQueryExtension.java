package org.zerock.todoserviceproject.domain.repository.todo.extension.query;

import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestQueryTodoDTO;
import org.zerock.todoserviceproject.domain.entity.TodoEntity;

import java.util.List;

public interface TodoRepositoryQueryExtension {

    List<TodoEntity> findListByDate(RequestQueryTodoDTO requestQueryTodoDTO);
    List<TodoEntity> findMonthlyListByDate(RequestQueryTodoDTO requestQueryTodoDTO);
}
