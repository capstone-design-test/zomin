package org.zerock.todoserviceproject.domain.repository.todoArchive.extension.query;

import org.zerock.todoserviceproject.domain.entity.archive.TodoArchiveEntity;

import java.util.List;

public interface TodoArchiveRepositoryQueryExtension {
    List<TodoArchiveEntity> findDeletedListByWriter(String writer);
}
