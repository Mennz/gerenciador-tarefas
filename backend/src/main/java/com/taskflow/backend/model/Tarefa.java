package com.taskflow.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "tb_tarefas")
@Data
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título da tarefa é obrigatório.")
    @Size(min = 3, max = 100, message = "O título deve ter entre 3 e 100 caracteres.")
    @Column(nullable = false, length = 100)
    private String titulo;

    @Size(max = 500, message = "A descrição não pode passar de 500 caracteres.")
    @Column(columnDefinition = "TEXT")
    private String descricao;

    @FutureOrPresent(message = "A data de vencimento não pode ser uma data passada.")
    private LocalDate dataVencimento;

    @Column(nullable = false)
    private boolean concluida = false;

    @Enumerated(EnumType.STRING)
    private Prioridade prioridade = Prioridade.MEDIA;
}