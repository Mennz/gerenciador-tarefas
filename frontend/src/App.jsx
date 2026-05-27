import { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';

// Componente Principal
function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');

  // 1. Buscar todas as tarefas ao carregar o ecrã
  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const response = await api.get('/tarefas');
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  };

  // 2. Criar uma nova tarefa
  const lidarComEnvio = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
      await api.post('/tarefas', {
        titulo,
        descricao,
        dataVencimento
      });
      // Limpar campos do formulário
      setTitulo('');
      setDescricao('');
      setDataVencimento('');
      // Atualizar a listagem
      carregarTarefas();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  // 3. Alternar o status de concluída (PUT)
  const alternarConclusao = async (tarefa) => {
    try {
      await api.put(`/tarefas/${tarefa.id}`, {
        ...tarefa,
        concluida: !tarefa.concluida
      });
      carregarTarefas();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  // 4. Eliminar uma tarefa (DELETE)
  const eliminarTarefa = async (id) => {
    if (window.confirm("Tens a certeza que desejas eliminar esta tarefa?")) {
      try {
        await api.delete(`/tarefas/${id}`);
        carregarTarefas();
      } catch (error) {
        console.error("Erro ao eliminar tarefa:", error);
      }
    }
  };

  return (
    <div className="container">
      <h1>TaskFlow - Gerenciador de Tarefas</h1>

      {/* Formulário de Cadastro */}
      <form onSubmit={lidarComEnvio} className="form-tarefa">
        <input 
          type="text" 
          placeholder="Título da tarefa..." 
          value={titulo} 
          onChange={(e) => setTitulo(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Descrição (opcional)..." 
          value={descricao} 
          onChange={(e) => setDescricao(e.target.value)} 
        />
        <input 
          type="date" 
          value={dataVencimento} 
          onChange={(e) => setDataVencimento(e.target.value)} 
        />
        <button type="submit">Adicionar Tarefa</button>
      </form>

      {/* Listagem das Tarefas */}
      <div className="lista-tarefas">
        <h2>Minhas Tarefas ({tarefas.length})</h2>
        {tarefas.length === 0 ? (
          <p>Nenhuma tarefa encontrada. Começa por criar uma!</p>
        ) : (
          <ul>
            {tarefas.map((tarefa) => (
              <li key={tarefa.id} className={`tarefa-item ${tarefa.concluida ? 'concluida' : ''}`}>
                <div className="tarefa-info">
                  <h3>{tarefa.titulo}</h3>
                  <p>{tarefa.descricao}</p>
                  {tarefa.dataVencimento && <small>Vence em: {tarefa.dataVencimento}</small>}
                </div>
                <div className="tarefa-acoes">
                  <button onClick={() => alternarConclusao(tarefa)}>
                    {tarefa.concluida ? 'Reabrir' : 'Concluir'}
                  </button>
                  <button onClick={() => eliminarTarefa(tarefa.id)} className="btn-deletar">
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;