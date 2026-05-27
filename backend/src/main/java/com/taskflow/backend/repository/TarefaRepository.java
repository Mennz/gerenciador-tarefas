package com.taskflow.backend.repository;

import com.taskflow.backend.model.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
    // O Spring Boot vai gerar automaticamente todo o CRUD básico aqui
}