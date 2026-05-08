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
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // localStorageに保存
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const remainingCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-3xl flex items-center justify-center">
            <span className="text-4xl">✅</span>
          </div>
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Todo</h1>
            <p className="text-emerald-400">React + Tailwind</p>
          </div>
        </div>

        {/* 入力欄 */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="新しいタスクを入力..."
            className="flex-1 bg-zinc-900 border border-zinc-700 focus:border-emerald-500 px-5 py-4 rounded-3xl text-lg outline-none"
          />
          <button
            onClick={addTodo}
            className="bg-emerald-600 hover:bg-emerald-700 px-8 rounded-3xl font-semibold transition-colors"
          >
            追加
          </button>
        </div>

        {/* Todoリスト */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          {filteredTodos.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              タスクがありません
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center px-6 py-4 border-b border-zinc-800 hover:bg-zinc-800/50 group transition-colors"
              >
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`w-7 h-7 rounded-2xl border-2 flex items-center justify-center mr-4 transition-all ${
                    todo.completed
                      ? 'bg-emerald-600 border-emerald-600'
                      : 'border-zinc-600 group-hover:border-emerald-500'
                  }`}
                >
                  {todo.completed && <span className="text-white">✓</span>}
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

        {/* フッター */}
        <div className="flex justify-between items-center mt-6 text-sm px-2">
          <div className="text-zinc-400">
            {remainingCount} 件のタスク
          </div>

          <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-1">
            {(['all', 'active', 'completed'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 text-sm rounded-xl transition-all ${
                  filter === type
                    ? 'bg-emerald-600 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {type === 'all' ? 'すべて' : type === 'active' ? '未完了' : '完了'}
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
