package org.zerock.todoserviceproject.application.dto.todo;

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
public class TodoDTO {
    private Long tno;
    private String writer;

    private String title;

    private LocalDate date;

    private LocalDateTime from;
    private LocalDateTime to;

    private boolean complete;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @ToString.Exclude private LocalDateTime regDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @ToString.Exclude private LocalDateTime modDate;


    public void changeTitle(String title) { this.title = title; }
    public void changeDate(LocalDate date) { this.date = date; }
    public void changeFrom(LocalDateTime from) { this.from = from; }
    public void changeTo(LocalDateTime to) { this.to = to; }
    public void changeComplete(boolean complete) { this.complete = complete; }
}
