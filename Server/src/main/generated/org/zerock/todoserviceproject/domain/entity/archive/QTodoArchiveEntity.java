package org.zerock.todoserviceproject.domain.entity.archive;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTodoArchiveEntity is a Querydsl query type for TodoArchiveEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTodoArchiveEntity extends EntityPathBase<TodoArchiveEntity> {

    private static final long serialVersionUID = -1342896734L;

    public static final QTodoArchiveEntity todoArchiveEntity = new QTodoArchiveEntity("todoArchiveEntity");

    public final org.zerock.todoserviceproject.domain.entity.base.QBaseArchiveTimeEntity _super = new org.zerock.todoserviceproject.domain.entity.base.QBaseArchiveTimeEntity(this);

    public final BooleanPath complete = createBoolean("complete");

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    //inherited
    public final NumberPath<Integer> delta = _super.delta;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> expireDate = _super.expireDate;

    public final DateTimePath<java.time.LocalDateTime> from = createDateTime("from", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> regdate = _super.regdate;

    public final StringPath title = createString("title");

    public final NumberPath<Long> tno = createNumber("tno", Long.class);

    public final DateTimePath<java.time.LocalDateTime> to = createDateTime("to", java.time.LocalDateTime.class);

    public final StringPath writer = createString("writer");

    public QTodoArchiveEntity(String variable) {
        super(TodoArchiveEntity.class, forVariable(variable));
    }

    public QTodoArchiveEntity(Path<? extends TodoArchiveEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTodoArchiveEntity(PathMetadata metadata) {
        super(TodoArchiveEntity.class, metadata);
    }

}

