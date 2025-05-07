package org.zerock.todoserviceproject.domain.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

import org.zerock.todoserviceproject.domain.entity.base.BaseAccessTimeEntity;
import org.zerock.todoserviceproject.domain.entity.converter.LocalDateTimeConverter;


@Entity
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="todo_tbl")
public class TodoEntity extends BaseAccessTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tno;   // 일반적인 ID (유저의 ID가 아닌 TODO 자체의 ID) todo_number


    @Column(
            name = "title",
            nullable = false,
            length = 100,
            columnDefinition = "VARCHAR(255) DEFAULT 'EMPTY'"
    )
    private String title;      // 제목 (Todo 제목)


    @Column(
            name = "date",
            nullable = false
    )
    private LocalDate date; // 작성한 날자? 아니면 TODO의 기준이 되는날짜? 이거는 편하신대로 하셔도 돼요



    @Column(
            name = "writer",
            nullable = false,
            length = 50,
            columnDefinition = "VARCHAR(64) DEFAULT 'ANONYMOUS'"
    )
    private String writer;  // 작성자 -> User의 고유한 ID가 되겠죠 tno랑은 다른 개념 (계정 ID로 넘겨주면 돼요) LOGIN YES


    @Column(
            name = "`from_time`",
            nullable = false,
            columnDefinition = "VARCHAR(16)"
    )
    @Convert(converter = LocalDateTimeConverter.class)
    private LocalDateTime from; // from-to      주위해야할 점: "2025-04-20 22:00" 따음표 붙이고, 날짜는 하이픈 '-' 으로 구별, 시간은 콜론 ':'으로 구별, 날짜하고 시간은 띄어쓰기


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
    private boolean complete;   // pass


}
