package org.zerock.todoserviceproject.domain.repository.todo.extension.query;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestQueryTodoDTO;
import org.zerock.todoserviceproject.domain.entity.QTodoEntity;
import org.zerock.todoserviceproject.domain.entity.TodoEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


public class TodoRepositoryQueryExtensionImpl extends QuerydslRepositorySupport
        implements TodoRepositoryQueryExtension {

    public TodoRepositoryQueryExtensionImpl() {
        super(TodoEntity.class);
    }

    @Override
    public List<TodoEntity> findListByDate(RequestQueryTodoDTO requestQueryTodoDTO) {
        LocalDateTime startOfDay = requestQueryTodoDTO.getDate().atStartOfDay();
        LocalDateTime endOfDay = requestQueryTodoDTO.getDate().atTime(23, 59);

        QTodoEntity todoEntity = QTodoEntity.todoEntity;

        JPQLQuery<TodoEntity> query = from(todoEntity);

        BooleanBuilder dateCondition = buildDateCondition(todoEntity, startOfDay, endOfDay);

        query.where(todoEntity.writer.eq(requestQueryTodoDTO.getWriter()));
        query.where(dateCondition);

        return query.fetch();
    }

    @Override
    public List<TodoEntity> findMonthlyListByDate(RequestQueryTodoDTO requestQueryTodoDTO) {
        LocalDateTime startOfMonth = LocalDateTime.of(
                requestQueryTodoDTO.getDate().getYear(),
                requestQueryTodoDTO.getDate().getMonth(),
                1, 0, 0, 0
        );

        LocalDateTime endOfMonth = requestQueryTodoDTO.getDate().atTime(23, 59);

        QTodoEntity todoEntity = QTodoEntity.todoEntity;

        JPQLQuery<TodoEntity> query = from(todoEntity);

        BooleanBuilder dateCondition = buildMonthCondition(todoEntity, startOfMonth, endOfMonth);

        query.where(todoEntity.writer.eq(requestQueryTodoDTO.getWriter()));
        query.where(dateCondition);

        return query.fetch();
    }

    private BooleanBuilder buildDateCondition(QTodoEntity todoEntity, LocalDateTime startofDay, LocalDateTime endofDay) {
        BooleanBuilder dateBuilder = new BooleanBuilder();
        BooleanBuilder fromCondition = new BooleanBuilder();
        BooleanBuilder toCondition = new BooleanBuilder();
        BooleanBuilder fromToCondition = new BooleanBuilder();

        fromCondition.and(todoEntity.from.goe(startofDay))
                .and(todoEntity.from.loe(endofDay));

        toCondition.and(todoEntity.to.goe(startofDay))
                .and(todoEntity.to.loe(endofDay));

        fromToCondition.and(todoEntity.from.loe(startofDay))
                        .and(todoEntity.to.goe(startofDay));


        dateBuilder.or(fromCondition).or(toCondition).or(fromToCondition);

        return dateBuilder;
    }


    private BooleanBuilder buildMonthCondition(QTodoEntity todoEntity, LocalDateTime startOfMonth, LocalDateTime endOfMonth) {
        BooleanBuilder dateBuilder = new BooleanBuilder();

        dateBuilder.and(todoEntity.to.goe(startOfMonth))
                .and(todoEntity.from.loe(endOfMonth));

        return dateBuilder;
    }

}
