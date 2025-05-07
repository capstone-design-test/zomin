package org.zerock.todoserviceproject.domain.service.module.query;

import java.util.Map;

import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestQueryTodoDTO;

// +-+-+-+-+-+-+-+
//      QUERY    |
// +-+-+-+-+-+-+-+
public interface TodoQueryService {

    Map<String, Object> requestQueryTodoList(RequestQueryTodoDTO requestQueryTodoDTO);
    Map<String, Object> requestQueryMontlyTodoList(RequestQueryTodoDTO requestQueryTodoDTO);
    Map<String, Object> requestQueryDeletedTodoList(String writer);
}
