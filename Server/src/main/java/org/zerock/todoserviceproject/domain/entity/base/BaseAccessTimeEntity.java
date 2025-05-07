package org.zerock.todoserviceproject.domain.entity.base;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.zerock.todoserviceproject.domain.entity.converter.LocalDateTimeConverter;

import java.time.LocalDateTime;


@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@lombok.Getter
public class BaseAccessTimeEntity {

    @CreatedDate
    @Column(
            name = "reg_date",
            columnDefinition = "VARCHAR(16)",
            updatable = false
    )
    @Convert(converter = LocalDateTimeConverter.class)
    private LocalDateTime regDate;


    @LastModifiedDate
    @Column(
            name = "mod_date",
            columnDefinition = "VARCHAR(16)"
    )
    @Convert(converter = LocalDateTimeConverter.class)
    private LocalDateTime modDate;

}
