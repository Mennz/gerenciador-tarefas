package com.taskflow.backend.controller;

import com.taskflow.backend.model.Tarefa;
import com.taskflow.backend.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarefas")
@CrossOrigin(origins = "*") // Permite que o Frontend (no futuro) aceda à API sem erros de CORS
public class TarefaController {

    @Autowired
    private TarefaRepository tarefaRepository;

    // Rota para listar todas as tarefas (GET http://localhost:8080/api/tarefas)
    @GetMapping
    public List<Tarefa> listarTodas() {
        return tarefaRepository.findAll();
    }

    // Rota para salvar uma nova tarefa (POST http://localhost:8080/api/tarefas)
    @PostMapping
    public Tarefa criar(@RequestBody Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }
}