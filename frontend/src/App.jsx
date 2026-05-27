import { useState, useEffect } from 'react';
import api from './services/api';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [prioridade, setPrioridade] = useState('MEDIA'); // Novo Estado

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

  const lidarComEnvio = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
      await api.post('/tarefas', {
        titulo,
        descricao,
        dataVencimento,
        prioridade // Enviando para a API
      });
      setTitulo('');
      setDescricao('');
      setDataVencimento('');
      setPrioridade('MEDIA');
      carregarTarefas();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

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

  // Função utilitária para definir as cores do Badge de prioridade
  const obterCorPrioridade = (prio) => {
    switch (prio) {
      case 'ALTA': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'MEDIA': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'BAIXA': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 antialiased p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Formulário */}
        <div className="md:col-span-1">
          <header className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">TaskFlow</h1>
            <p className="text-sm text-slate-500 mt-1">Gerenciador de tarefas corporativo</p>
          </header>

          <form onSubmit={lidarComEnvio} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-700">Nova Tarefa</h2>
            
            <div>
              <input 
                type="text" 
                placeholder="Título da tarefa *" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <textarea 
                placeholder="Descrição (opcional)" 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                rows="3"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Prioridade</label>
              <select 
                value={prioridade} 
                onChange={(e) => setPrioridade(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Data de Vencimento</label>
              <input 
                type="date" 
                value={dataVencimento} 
                onChange={(e) => setDataVencimento(e.target.value)} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition shadow-sm"
            >
              Criar Tarefa
            </button>
          </form>
        </div>

        {/* Listagem */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Minhas Tarefas</h2>
            <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {tarefas.length} total
            </span>
          </div>

          {tarefas.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
              <p>Nenhuma tarefa agendada. Descanse um pouco ou crie uma nova!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tarefas.map((tarefa) => (
                <div 
                  key={tarefa.id} 
                  className={`p-4 bg-white rounded-xl border transition flex items-center justify-between gap-4 shadow-sm
                    ${tarefa.concluida ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-slate-900 truncate ${tarefa.concluida ? 'line-through text-slate-400' : ''}`}>
                        {tarefa.titulo}
                      </h3>
                      {/* Badge de Prioridade Dinâmico */}
                      {!tarefa.concluida && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${obterCorPrioridade(tarefa.prioridade)}`}>
                          {tarefa.prioridade}
                        </span>
                      )}
                    </div>
                    
                    {tarefa.descricao && (
                      <p className={`text-sm text-slate-600 ${tarefa.concluida ? 'line-through text-slate-400' : ''}`}>
                        {tarefa.descricao}
                      </p>
                    )}
                    {tarefa.dataVencimento && (
                      <span className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        🗓️ Vence em: {tarefa.dataVencimento}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => alternarConclusao(tarefa)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border
                        ${tarefa.concluida 
                          ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                    >
                      {tarefa.concluida ? 'Reabrir' : 'Concluir'}
                    </button>
                    <button 
                      onClick={() => eliminarTarefa(tarefa.id)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium hover:bg-rose-100 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;