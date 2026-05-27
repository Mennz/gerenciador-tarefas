package com.taskflow.backend.model;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "tb_tarefas")
@Data //Lombok
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private LocalDate dataVencimento;

    @Column(nullable = false)
    private boolean concluida = false;

    @Enumerated(EnumType.STRING)
    private Prioridade prioridade = Prioridade.MEDIA;
}