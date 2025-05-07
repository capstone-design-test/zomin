package org.zerock.todoserviceproject.domain.service.module.query;


import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.zerock.todoserviceproject.application.dto.todo.TodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.archive.TodoArchiveDTO;
import org.zerock.todoserviceproject.application.dto.todo.archive.projection.response.ResponseQueryTodoArchiveDTO;
import org.zerock.todoserviceproject.application.dto.todo.map.ProjectionMapper;
import org.zerock.todoserviceproject.application.dto.todo.map.ResponseMapper;
import org.zerock.todoserviceproject.application.dto.todo.projection.request.RequestQueryTodoDTO;
import org.zerock.todoserviceproject.application.dto.todo.projection.response.ResponseQueryTodoDTO;
import org.zerock.todoserviceproject.domain.entity.archive.TodoArchiveEntity;
import org.zerock.todoserviceproject.domain.repository.todoArchive.TodoArchiveRepository;
import org.zerock.todoserviceproject.domain.repository.todo.TodoRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Log4j2
@RequiredArgsConstructor
public class TodoQueryServiceImpl implements TodoQueryService {

    private final TodoRepository todoRepository;
    private final TodoArchiveRepository todoArchiveRepository;
    private final ResponseMapper responseMapper;
    private final ProjectionMapper projectionMapper;


    @Override
    public Map<String, Object> requestQueryTodoList(RequestQueryTodoDTO requestQueryTodoDTO) {
        List<TodoDTO> todoDTOList = this.todoRepository.findListByDate(requestQueryTodoDTO).stream()
                .map(projectionMapper::mapToDTO)
                .toList();

        List<ResponseQueryTodoDTO> responseBodyTodoDTOList = todoDTOList.stream()
                .map(responseMapper::mapToQueryResponseTodoDTO)
                .toList();

        List<Map<String, String>> responseMappedTodoDTOList = responseBodyTodoDTOList.stream()
                .map(responseMapper::getResponseMap)
                .toList();


        Map<String, Object> responseMap = new HashMap<>();

        responseMap.put("execution", "query");
        responseMap.put("list", responseMappedTodoDTOList);
        responseMap.put("status", "success");


        return responseMap;
    }

    @Override
    public Map<String, Object> requestQueryMontlyTodoList(RequestQueryTodoDTO requestQueryTodoDTO) {
        List<TodoDTO> monthlyTodoDTOList = this.todoRepository.findMonthlyListByDate(requestQueryTodoDTO).stream()
                .map(projectionMapper::mapToDTO)
                .toList();

        List<ResponseQueryTodoDTO> responseBodyMonthlyDTOList = monthlyTodoDTOList.stream()
                .map(responseMapper::mapToQueryResponseTodoDTO)
                .toList();

        List<Map<String, String>> responseMappedMontlyTodoDTOList = responseBodyMonthlyDTOList.stream()
                .map(responseMapper::getResponseMap)
                .toList();

        Map<String, Object> responseMap = new HashMap<>();

        responseMap.put("execution", "query");
        responseMap.put("list", responseMappedMontlyTodoDTOList);
        responseMap.put("status", "success");

        return responseMap;
    }

    @Override
    public Map<String, Object> requestQueryDeletedTodoList(String targetWriter) {
        this.cleanUpExpiredTodos(targetWriter);

        List<TodoArchiveDTO> todoArchiveEntityList = this.todoArchiveRepository
                .findDeletedListByWriter(targetWriter).stream()
                .map(this.projectionMapper::mapToDTO)
                .toList();

        List<ResponseQueryTodoArchiveDTO> responseBodyTodoArchiveDTOList = todoArchiveEntityList.stream()
                .map(responseMapper::mapToQueryResponseTodoArchiveDTO)
                .toList();

        List<Map<String, String>> responseMappedTodoArchiveDTOList = responseBodyTodoArchiveDTOList.stream()
                .map(responseMapper::getResponseMap)
                .toList();

        Map<String, Object> responseMap = new HashMap<>();

        responseMap.put("execution", "query_deleted");
        responseMap.put("list", responseMappedTodoArchiveDTOList);
        responseMap.put("status", "success");

        return responseMap;

    }


    private void cleanUpExpiredTodos(String targetWriter) {
        List<Long> expiredDeletedTodoEntitieTnos =
                this.todoArchiveRepository.findRemoveExpiredTargets(targetWriter)
                        .stream()
                        .map(TodoArchiveEntity::getTno)
                        .toList();

        this.todoArchiveRepository.deleteAllById(expiredDeletedTodoEntitieTnos);

    }
}
