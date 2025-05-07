package org.zerock.todoserviceproject.application.dto.todo.map;


import org.springframework.stereotype.Component;
import org.zerock.todoserviceproject.application.dto.todo.TodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.archive.TodoArchiveDTO;
import org.zerock.todoserviceproject.application.dto.todo.archive.projection.response.ResponseQueryTodoArchiveDTO;
import org.zerock.todoserviceproject.application.dto.todo.projection.response.ResponseModifyTodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.projection.response.ResponseQueryTodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.projection.response.ResponseRegisterTodoDTO;

import java.util.HashMap;
import java.util.Map;

@Component
public class ResponseMapper {
    private static final String REGISTER = "register";
    private static final String MODIFY = "modify";
    private static final String SUCCESS_STATUS = "success";

    public Map<String, String> getResponseMap(ResponseRegisterTodoDTO responseRegisterTodoDTO) {

        Map<String, String> responseMap = new HashMap<>();

        responseMap.put("execution", responseRegisterTodoDTO.getExecution());
        responseMap.put("writer", responseRegisterTodoDTO.getWriter());
        responseMap.put("tno", responseRegisterTodoDTO.getTno().toString());
        responseMap.put("status", responseRegisterTodoDTO.getStatus());

        return responseMap;
    }


    public Map<String, String> getResponseMap(ResponseQueryTodoDTO responseQueryTodoDTO) {

        Map<String, String> responseMap = new HashMap<>();

        responseMap.put("writer", responseQueryTodoDTO.getWriter());
        responseMap.put("date", responseQueryTodoDTO.getDate().toString());
        responseMap.put("tno", responseQueryTodoDTO.getTno().toString());
        responseMap.put("from", responseQueryTodoDTO.getFrom().toString().replace("T", " "));
        responseMap.put("to", responseQueryTodoDTO.getTo().toString().replace("T", " "));
        responseMap.put("title", responseQueryTodoDTO.getTitle());
        responseMap.put("complete", responseQueryTodoDTO.isComplete() ? "true" : "false");

        return responseMap;
    }


    public Map<String, String> getResponseMap(ResponseQueryTodoArchiveDTO responseQueryTodoArchiveDTO) {

        Map<String, String> responseMap = new HashMap<>();

        responseMap.put("writer", responseQueryTodoArchiveDTO.getWriter());
        responseMap.put("date", responseQueryTodoArchiveDTO.getDate().toString());
        responseMap.put("tno", responseQueryTodoArchiveDTO.getTno().toString());
        responseMap.put("from", responseQueryTodoArchiveDTO.getFrom().toString().replace("T", " "));
        responseMap.put("to", responseQueryTodoArchiveDTO.getTo().toString().replace("T", " "));
        responseMap.put("expire", responseQueryTodoArchiveDTO.getExpireDate().toString().replace("T", " "));
        responseMap.put("title", responseQueryTodoArchiveDTO.getTitle());
        responseMap.put("complete", responseQueryTodoArchiveDTO.isComplete() ? "true" : "false");

        return responseMap;
    }



    public Map<String, String> getResponseMap(ResponseModifyTodoDTO responseModifyTodoDTO) {
        Map<String, String> responseMap = new HashMap<>();

        responseMap.put("execution", responseModifyTodoDTO.getExecution());
        responseMap.put("writer", responseModifyTodoDTO.getWriter());
        responseMap.put("tno", responseModifyTodoDTO.getTno().toString());
        responseMap.put("status", responseModifyTodoDTO.getStatus());

        return responseMap;
    }


    public ResponseRegisterTodoDTO mapToRegisterResponseTodoDTO(TodoDTO todoDTO) {
        return ResponseRegisterTodoDTO.builder()
                .tno(todoDTO.getTno())
                .writer(todoDTO.getWriter())
                .execution(REGISTER)
                .status(SUCCESS_STATUS)
                .build();
    }


    public ResponseQueryTodoDTO mapToQueryResponseTodoDTO(TodoDTO todoDTO) {
        return ResponseQueryTodoDTO.builder()
                .tno(todoDTO.getTno())
                .writer(todoDTO.getWriter())
                .title(todoDTO.getTitle())
                .date(todoDTO.getDate())
                .from(todoDTO.getFrom())
                .to(todoDTO.getTo())
                .complete(todoDTO.isComplete())
                .build();
    }


    public ResponseQueryTodoArchiveDTO mapToQueryResponseTodoArchiveDTO(TodoArchiveDTO todoArchiveDTO) {
        return ResponseQueryTodoArchiveDTO.builder()
                .tno(todoArchiveDTO.getTno())
                .writer(todoArchiveDTO.getWriter())
                .title(todoArchiveDTO.getTitle())
                .date(todoArchiveDTO.getDate())
                .from(todoArchiveDTO.getFrom())
                .to(todoArchiveDTO.getTo())
                .expireDate(todoArchiveDTO.getExpireDate())
                .complete(todoArchiveDTO.isComplete())
                .build();
    }


    public ResponseModifyTodoDTO mapToModifyResponseTodoDTO(TodoDTO todoDTO) {
        return ResponseModifyTodoDTO.builder()
                .tno(todoDTO.getTno())
                .writer(todoDTO.getWriter())
                .execution(MODIFY)
                .status(SUCCESS_STATUS)
                .build();
    }
}
