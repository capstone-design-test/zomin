package org.zerock.todoserviceproject.domain.service.module.register;

import jakarta.transaction.Transactional;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRegisterTodoDTO;

import java.util.Map;

// +-+-+-+-+-+-+-+
//   REGISTER    |
// +-+-+-+-+-+-+-+
public interface TodoRegisterService {

    @Transactional
    Map<String, String> requestRegister(RequestRegisterTodoDTO requestRegisterTodoDTO);

}
