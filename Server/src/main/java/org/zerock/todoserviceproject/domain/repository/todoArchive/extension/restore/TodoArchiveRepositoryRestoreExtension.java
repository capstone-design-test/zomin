package org.zerock.todoserviceproject.domain.repository.todoArchive.extension.restore;

import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRestoreTodoDTO;
import org.zerock.todoserviceproject.domain.entity.archive.TodoArchiveEntity;

public interface TodoArchiveRepositoryRestoreExtension {
    TodoArchiveEntity findRestoreTarget(RequestRestoreTodoDTO requestRestoreTodoDTO);
}
