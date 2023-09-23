import { renderToString } from 'react-dom/server'

Bun.serve({
  hostname: 'localhost',
  port: 3000,
  fetch: fetchHandler,
})

type Todo = { id: number; name: string };
const todos: Todo[] = [];

async function fetchHandler(request: Request): Promise<Response> {
  const url = new URL(request.url)

  if (url.pathname === '' || url.pathname === '/') {
    return new Response(Bun.file('index.html'))
  }

  if (url.pathname === '/todos' && request.method === 'GET') {
    return new Response(renderToString(<TodoList todos={todos} />))
  }

  if (url.pathname === '/todos' && request.method === 'POST') {
    const { todo } = await request.json()
    todos.push({ id: todo.length + 1, name: todo });
    return new Response(renderToString(<TodoList todos={todos} />))
  }

  return new Response('Not Found', { status: 404 });
}

function TodoList(props: { todos: Todo[] }) {
  return <ul>
    {
      props.todos.length ?
        props.todos.map(todo => <li key={`todo-${todo.id}`}>{todo.name}</li>) :
        <p> No todo found!</p>
    }

  </ul >
}

console.log('Server running on http://localhost:3000')
