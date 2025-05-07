package org.zerock.todoserviceproject.domain.entity.base;


import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.zerock.todoserviceproject.domain.entity.converter.LocalDateTimeConverter;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@lombok.Getter
public class BaseArchiveTimeEntity {

    @CreatedDate
    @Column(
            name = "reg_date",
            columnDefinition = "VARCHAR(16)",
            updatable = false
    )
    @Convert(converter = LocalDateTimeConverter.class)
    private LocalDateTime regdate;


    @Column(
            name = "expire_date",
            columnDefinition = "VARCHAR(16)",
            updatable = false
    )
    @Convert(converter = LocalDateTimeConverter.class)
    private LocalDateTime expireDate;   // 자동 보관된 todo가 완전히 삭제되는 일자


    @Column(
            name = "delta",
            nullable = false,
            columnDefinition = "SMALLINT"
    )
    private Integer delta;  // 며칠동안 보관할꺼야?


    @PrePersist
    public void calculateExpireDate() {
        if (regdate == null) {
            regdate = LocalDateTime.now();
        }
        expireDate = regdate.plusDays(delta);
    }

}
