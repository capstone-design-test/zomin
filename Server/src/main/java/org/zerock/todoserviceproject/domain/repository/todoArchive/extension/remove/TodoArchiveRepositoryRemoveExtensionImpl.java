package org.zerock.todoserviceproject.domain.repository.todoArchive.extension.remove;

import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.zerock.todoserviceproject.domain.entity.archive.QTodoArchiveEntity;
import org.zerock.todoserviceproject.domain.entity.archive.TodoArchiveEntity;

import java.time.LocalDateTime;
import java.util.List;


public class TodoArchiveRepositoryRemoveExtensionImpl extends QuerydslRepositorySupport
        implements TodoArchiveRepositoryRemoveExtension {

    public TodoArchiveRepositoryRemoveExtensionImpl() {
        super(TodoArchiveEntity.class);
    }

    @Override
    public List<TodoArchiveEntity> findRemoveExpiredTargets(String targetWriter) {
        QTodoArchiveEntity todoArchiveEntity = QTodoArchiveEntity.todoArchiveEntity;

        JPQLQuery<TodoArchiveEntity> query = from(todoArchiveEntity);

        query.where(todoArchiveEntity.writer.eq(targetWriter));
        query.where(todoArchiveEntity.expireDate.loe(LocalDateTime.now()));

        return query.fetch();
    }
}
