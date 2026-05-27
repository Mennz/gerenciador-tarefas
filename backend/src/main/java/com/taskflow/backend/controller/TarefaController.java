package com.taskflow.backend.controller;

import com.taskflow.backend.model.Tarefa;
import com.taskflow.backend.service.TarefaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tarefas")
@CrossOrigin(origins = "*")
public class TarefaController {

    @Autowired
    private TarefaService tarefaService;

    // Rota para listar todas as tarefas (GET http://localhost:8080/api/tarefas)
    @GetMapping
    public ResponseEntity<List<Tarefa>> listarTodas() {
        List<Tarefa> tarefas = tarefaService.listarTodas();
        return ResponseEntity.ok(tarefas); // Retorna 200 OK com a lista
    }

    // Rota para criar uma nova tarefa (POST http://localhost:8080/api/tarefas)
    @PostMapping
    public ResponseEntity<Tarefa> criar(@RequestBody Tarefa tarefa) {
        Tarefa novaTarefa = tarefaService.salvar(tarefa);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaTarefa); // Retorna 201 Created
    }

    // Rota para atualizar (PUT http://localhost:8080/api/tarefas/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Tarefa> atualizar(@PathVariable Long id, @RequestBody Tarefa tarefa) {
        try {
            Tarefa tarefaAtualizada = tarefaService.atualizar(id, tarefa);
            return ResponseEntity.ok(tarefaAtualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Retorna 404 Not Found se o ID não existir
        }
    }

    // Rota para deletar (DELETE http://localhost:8080/api/tarefas/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        try {
            tarefaService.deletar(id);
            return ResponseEntity.noContent().build(); // Retorna 204 No Content (padrão corporativo para deleção bem-sucedida)
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}