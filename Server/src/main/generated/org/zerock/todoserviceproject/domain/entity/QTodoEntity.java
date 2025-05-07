package org.zerock.todoserviceproject.domain.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTodoEntity is a Querydsl query type for TodoEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTodoEntity extends EntityPathBase<TodoEntity> {

    private static final long serialVersionUID = -1924086662L;

    public static final QTodoEntity todoEntity = new QTodoEntity("todoEntity");

    public final org.zerock.todoserviceproject.domain.entity.base.QBaseAccessTimeEntity _super = new org.zerock.todoserviceproject.domain.entity.base.QBaseAccessTimeEntity(this);

    public final BooleanPath complete = createBoolean("complete");

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    public final DateTimePath<java.time.LocalDateTime> from = createDateTime("from", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modDate = _super.modDate;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> regDate = _super.regDate;

    public final StringPath title = createString("title");

    public final NumberPath<Long> tno = createNumber("tno", Long.class);

    public final DateTimePath<java.time.LocalDateTime> to = createDateTime("to", java.time.LocalDateTime.class);

    public final StringPath writer = createString("writer");

    public QTodoEntity(String variable) {
        super(TodoEntity.class, forVariable(variable));
    }

    public QTodoEntity(Path<? extends TodoEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTodoEntity(PathMetadata metadata) {
        super(TodoEntity.class, metadata);
    }

}

