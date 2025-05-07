package org.zerock.todoserviceproject.domain.repository.todoArchive.extension.restore;

import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRestoreTodoDTO;
import org.zerock.todoserviceproject.domain.entity.archive.QTodoArchiveEntity;
import org.zerock.todoserviceproject.domain.entity.archive.TodoArchiveEntity;

public class TodoArchiveRepositoryRestoreExtensionImpl extends QuerydslRepositorySupport
        implements TodoArchiveRepositoryRestoreExtension {


    public TodoArchiveRepositoryRestoreExtensionImpl() {
        super(TodoArchiveEntity.class);
    }


    @Override
    public TodoArchiveEntity findRestoreTarget(RequestRestoreTodoDTO requestRestoreTodoDTO) {
        QTodoArchiveEntity todoArchiveEntity = QTodoArchiveEntity.todoArchiveEntity;

        JPQLQuery<TodoArchiveEntity> query = from(todoArchiveEntity);

        query.where(todoArchiveEntity.tno.eq(requestRestoreTodoDTO.getTno()));
        query.where(todoArchiveEntity.writer.eq(requestRestoreTodoDTO.getWriter()));

        return query.fetch().get(0);
    }
}
