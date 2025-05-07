package org.zerock.todoserviceproject.domain.service.module.remove;


import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRemoveTodoDTO;

import java.util.Map;

// +-+-+-+-+-+-+-+
//     REMOVE    |
// +-+-+-+-+-+-+-+
public interface TodoRemoveService {

    Map<String, String> requestRemove(RequestRemoveTodoDTO requestRemoveTodoDTO);

}
