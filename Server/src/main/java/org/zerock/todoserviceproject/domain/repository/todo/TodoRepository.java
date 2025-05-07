package org.zerock.todoserviceproject.domain.repository.todo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerock.todoserviceproject.domain.entity.TodoEntity;
import org.zerock.todoserviceproject.domain.repository.todo.extension.query.TodoRepositoryQueryExtension;
import org.zerock.todoserviceproject.domain.repository.todo.extension.remove.TodoRepositoryRemoveExtension;

@Repository
public interface TodoRepository extends
        JpaRepository<TodoEntity, Long>,
        TodoRepositoryQueryExtension,
        TodoRepositoryRemoveExtension {
}
