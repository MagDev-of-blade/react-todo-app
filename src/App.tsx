import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // localStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  // localStorageに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-3xl flex items-center justify-center">
            <span className="text-3xl">📝</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold tracking-tighter">React Todo</h1>
            <p className="text-emerald-400">TypeScript + Tailwind</p>
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-emerald-500 px-5 py-4 rounded-3xl outline-none text-lg"
          />
          <button
            onClick={addTodo}
            className="bg-emerald-600 hover:bg-emerald-700 px-8 rounded-3xl font-semibold transition-colors"
          >
            追加
          </button>
        </div>

        {/* Todo List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          {filteredTodos.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              タスクがありません
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center px-6 py-4 border-b border-zinc-800 group hover:bg-zinc-800/50 transition-colors"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-7 h-7 rounded-2xl border-2 flex-shrink-0 mr-4 flex items-center justify-center transition-all ${
                    todo.completed 
                      ? 'bg-emerald-600 border-emerald-600' 
                      : 'border-zinc-600 group-hover:border-emerald-500'
                  }`}
                >
                  {todo.completed && <span className="text-white text-sm">✓</span>}
                </button>

                <span
                  className={`flex-1 text-lg ${todo.completed ? 'line-through text-zinc-500' : ''}`}
                >
                  {todo.text}
                </span>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 p-2 transition-all"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 text-sm px-1">
          <div className="text-zinc-400">
            {activeCount} 件のタスク
          </div>

          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-1">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-xl text-sm transition-all ${
                  filter === f 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'すべて' : f === 'active' ? '未完了' : '完了'}
              </button>
            ))}
          </div>

          <button
            onClick={clearCompleted}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            完了をクリア
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;