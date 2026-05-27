package com.taskflow.backend.service;

import com.taskflow.backend.model.Tarefa;
import com.taskflow.backend.repository.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TarefaService {

    @Autowired
    private TarefaRepository tarefaRepository;

    public List<Tarefa> listarTodas() {
        return tarefaRepository.findAll();
    }

    // Salvar uma nova tarefa
    public Tarefa salvar(Tarefa tarefa) {
        if (tarefa.getTitulo() == null || tarefa.getTitulo().trim().isEmpty()) {
            throw new IllegalArgumentException("O título da tarefa não pode ser vazio.");
        }

        // Nova Regra: Título e Descrição não podem ser iguais
        if (tarefa.getDescricao() != null && !tarefa.getDescricao().trim().isEmpty()) {
            if (tarefa.getTitulo().trim().equalsIgnoreCase(tarefa.getDescricao().trim())) {
                throw new IllegalArgumentException("O título e a descrição da tarefa não podem ser idênticos.");
            }
        }

        return tarefaRepository.save(tarefa);
    }

    // Buscar uma tarefa por ID (útil para validações)
    public Tarefa buscarPorId(Long id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada com o ID: " + id));
    }

    // Atualizar uma tarefa existente
    public Tarefa atualizar(Long id, Tarefa dadosAtualizados) {
        Tarefa tarefaExistente = buscarPorId(id);
        // Atualiza a prioridade
        tarefaExistente.setPrioridade(dadosAtualizados.getPrioridade());
        
        // Atualiza os campos vindos do formulário
        tarefaExistente.setTitulo(dadosAtualizados.getTitulo());
        tarefaExistente.setDescricao(dadosAtualizados.getDescricao());
        tarefaExistente.setDataVencimento(dadosAtualizados.getDataVencimento());
        tarefaExistente.setConcluida(dadosAtualizados.isConcluida());

        // Nova Regra: Título e Descrição não podem ser iguais
        if (tarefaExistente.getDescricao() != null && tarefaExistente.getTitulo().trim().equalsIgnoreCase(tarefaExistente.getDescricao().trim())) {
        throw new IllegalArgumentException("O título e a descrição da tarefa não podem ser idênticos.");
        }
        
        return tarefaRepository.save(tarefaExistente);
    }

    // Deletar uma tarefa
    public void deletar(Long id) {
        Tarefa tarefa = buscarPorId(id);
        tarefaRepository.delete(tarefa);
    }
}