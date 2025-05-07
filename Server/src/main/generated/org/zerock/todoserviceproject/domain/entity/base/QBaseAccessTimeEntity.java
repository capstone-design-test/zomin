package org.zerock.todoserviceproject.domain.entity.base;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBaseAccessTimeEntity is a Querydsl query type for BaseAccessTimeEntity
 */
@Generated("com.querydsl.codegen.DefaultSupertypeSerializer")
public class QBaseAccessTimeEntity extends EntityPathBase<BaseAccessTimeEntity> {

    private static final long serialVersionUID = 1588517105L;

    public static final QBaseAccessTimeEntity baseAccessTimeEntity = new QBaseAccessTimeEntity("baseAccessTimeEntity");

    public final DateTimePath<java.time.LocalDateTime> modDate = createDateTime("modDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> regDate = createDateTime("regDate", java.time.LocalDateTime.class);

    public QBaseAccessTimeEntity(String variable) {
        super(BaseAccessTimeEntity.class, forVariable(variable));
    }

    public QBaseAccessTimeEntity(Path<? extends BaseAccessTimeEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBaseAccessTimeEntity(PathMetadata metadata) {
        super(BaseAccessTimeEntity.class, metadata);
    }

}

