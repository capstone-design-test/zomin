package org.zerock.todoserviceproject.application.dto.todo.archive;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TodoArchiveDTO {
    private Long tno;
    private String writer;

    private String title;

    private LocalDate date;

    private LocalDateTime from;
    private LocalDateTime to;

    private boolean complete;

    private Integer delta;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @ToString.Exclude private LocalDateTime regDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @ToString.Exclude private LocalDateTime expireDate;
}
