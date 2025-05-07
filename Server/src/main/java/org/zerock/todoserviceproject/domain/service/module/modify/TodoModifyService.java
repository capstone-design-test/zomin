package org.zerock.todoserviceproject.domain.service.module.modify;


import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestModifyTodoDTO;

import java.util.Map;

// +-+-+-+-+-+-+-+
//     UPDATE    |
// +-+-+-+-+-+-+-+
public interface TodoModifyService {

    Map<String, String> requestModify(RequestModifyTodoDTO requestModifyTodoDTO);
}
