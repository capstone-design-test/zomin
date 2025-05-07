package org.zerock.todoserviceproject.domain.repository.todoArchive.extension.query;

import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.zerock.todoserviceproject.domain.entity.archive.QTodoArchiveEntity;
import org.zerock.todoserviceproject.domain.entity.archive.TodoArchiveEntity;

import java.util.List;

public class TodoArchiveRepositoryQueryExtensionImpl extends QuerydslRepositorySupport
        implements TodoArchiveRepositoryQueryExtension {


    public TodoArchiveRepositoryQueryExtensionImpl() {
        super(TodoArchiveEntity.class);
    }

    @Override
    public List<TodoArchiveEntity> findDeletedListByWriter(String targetWriter) {

        QTodoArchiveEntity todoArchiveEntity = QTodoArchiveEntity.todoArchiveEntity;

        JPQLQuery<TodoArchiveEntity> query = from(todoArchiveEntity);

        query.where(todoArchiveEntity.writer.eq(targetWriter));

        return query.fetch();
    }
}
