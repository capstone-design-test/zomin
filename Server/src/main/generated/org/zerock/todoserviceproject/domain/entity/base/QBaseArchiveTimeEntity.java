package org.zerock.todoserviceproject.domain.entity.base;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBaseArchiveTimeEntity is a Querydsl query type for BaseArchiveTimeEntity
 */
@Generated("com.querydsl.codegen.DefaultSupertypeSerializer")
public class QBaseArchiveTimeEntity extends EntityPathBase<BaseArchiveTimeEntity> {

    private static final long serialVersionUID = 938120117L;

    public static final QBaseArchiveTimeEntity baseArchiveTimeEntity = new QBaseArchiveTimeEntity("baseArchiveTimeEntity");

    public final NumberPath<Integer> delta = createNumber("delta", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> expireDate = createDateTime("expireDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> regdate = createDateTime("regdate", java.time.LocalDateTime.class);

    public QBaseArchiveTimeEntity(String variable) {
        super(BaseArchiveTimeEntity.class, forVariable(variable));
    }

    public QBaseArchiveTimeEntity(Path<? extends BaseArchiveTimeEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBaseArchiveTimeEntity(PathMetadata metadata) {
        super(BaseArchiveTimeEntity.class, metadata);
    }

}

