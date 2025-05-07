package org.zerock.todoserviceproject.domain.service.module.restore;


import jakarta.transaction.Transactional;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRestoreTodoDTO;

import java.util.Map;

// +-+-+-+-+-+-+-+
//     RESTORE   |
// +-+-+-+-+-+-+-+
public interface TodoRestoreService {
    @Transactional
    Map<String, String> requestRestore(RequestRestoreTodoDTO requestRestoreTodoDTO);
}
