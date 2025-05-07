package org.zerock.todoserviceproject.domain.repository.todo.extension.remove;

import com.querydsl.jpa.JPQLQuery;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestRemoveTodoDTO;
import org.zerock.todoserviceproject.domain.entity.QTodoEntity;
import org.zerock.todoserviceproject.domain.entity.TodoEntity;


@Log4j2
public class TodoRepositoryRemoveExtensionImpl extends QuerydslRepositorySupport
        implements TodoRepositoryRemoveExtension {

    public TodoRepositoryRemoveExtensionImpl() {
        super(TodoEntity.class);
    }

    @Override
    public TodoEntity findRemoveTarget(RequestRemoveTodoDTO requestRemoveTodoDTO) {
        QTodoEntity todoEntity = QTodoEntity.todoEntity;

        JPQLQuery<TodoEntity> query = from(todoEntity);

        query.where(todoEntity.tno.eq(requestRemoveTodoDTO.getTno()));
        query.where(todoEntity.writer.eq(requestRemoveTodoDTO.getWriter()));

        return query.fetch().get(0);
    }
}
