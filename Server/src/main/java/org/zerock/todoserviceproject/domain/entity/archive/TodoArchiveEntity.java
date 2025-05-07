package org.zerock.todoserviceproject.domain.entity.archive;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.zerock.todoserviceproject.domain.entity.base.BaseArchiveTimeEntity;
import org.zerock.todoserviceproject.domain.entity.converter.LocalDateTimeConverter;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="todo_archive_tbl")
public class TodoArchiveEntity extends BaseArchiveTimeEntity {
    @Id
    private Long tno;

    @Column(
            name = "title",
            nullable = false,
            length = 100,
            columnDefinition = "VARCHAR(255) DEFAULT 'EMPTY'"
    )
    private String title;


    @Column(
            name = "date",
            nullable = false
    )
    private LocalDate date;


    @Column(
            name = "writer",
            nullable = false,
            length = 50,
            columnDefinition = "VARCHAR(64) DEFAULT 'ANONYMOUS'"
    )
    private String writer;


    @Column(
            name = "`from_time`",
            nullable = false,
            columnDefinition = "VARCHAR(16)"
    )
    @Convert(converter = LocalDateTimeConverter.class)
    private LocalDateTime from;


    @Column(
            name = "to_time",
            nullable = false,
            columnDefinition = "VARCHAR(16)"
    )
    @Convert(converter = LocalDateTimeConverter.class)
    private LocalDateTime to;


    @Column(
            name = "complete",
            nullable = false,
            columnDefinition = "BOOLEAN DEFAULT false"
    )
    private boolean complete;
}
