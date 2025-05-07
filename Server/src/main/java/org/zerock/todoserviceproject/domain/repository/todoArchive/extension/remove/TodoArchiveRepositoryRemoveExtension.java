package org.zerock.todoserviceproject.domain.repository.todoArchive.extension.remove;

import org.zerock.todoserviceproject.domain.entity.archive.TodoArchiveEntity;

import java.util.List;

public interface TodoArchiveRepositoryRemoveExtension {

    List<TodoArchiveEntity> findRemoveExpiredTargets(String targetWriter);
}
