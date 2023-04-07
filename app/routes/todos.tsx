import type { LoaderArgs} from '@remix-run/node';
import { json, redirect } from '@remix-run/node'
import {
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useSubmit
} from '@remix-run/react'
import React from 'react'
import { isAuthenticated } from '~/server/auth.server'
import { prisma } from '~/server/prisma.server'

export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
        createdAt: 'desc'
    }
  })

  return json({ todos })
}

export default function TodosHome() {
  const data = useLoaderData<typeof loader>()
  const deleteFetcher = useFetcher()
  const completedSubmit = useSubmit()
  const completedFetcher = useFetcher()
  function handleCompletedChange(event: React.ChangeEvent<HTMLFormElement>) {
    completedSubmit(event.currentTarget, {
      replace: true
    })
  }
  return (
    <div className='flex flex-col gap-4 items-center mx-auto w-screen h-screen'>
      <h1 className='text-2xl'>ToDo</h1>
      <div>
        <Link
          to='/todos/new'
          className='text-white px-3 py-2 rounded-md bg-green-500 hover:bg-green-700'
        >
          New Todo
        </Link>
      </div>
      <Outlet />
      <div className='flex flex-col gap-2'>
        <ul className=''>
          {data.todos.map((todo) => (
            <li
              className='flex mt-4 p-1 gap-2 border justify-between items-center overflow-hidden rounded-md shadow-md'
              key={todo.id}
            >
              <div className='flex flex-col gap-2'>
                <h3 className=''>{todo.title}</h3>
              </div>
              <div>
                {/* <h4 className='text-lg'>
                  Completed: {todo.completed ? '✅' : '❌'}
                </h4> */}
                                  <div className='flex flex-col gap-2'>


                      </div>

              </div>

              <div className='flex flex-row gap-2'>
                      <completedFetcher.Form
                          method='POST'
                          action={ `/todos/${todo.id}/completed` }
                          onChange={ handleCompletedChange }
                          className='flex flex-col gap-2'
                      >
                          <div className='flex flex-col gap-2'>
                              <label htmlFor='completed'>
                                  Completed
                              </label>
                              <input
                                  className='rounded text-black'
                                  type='checkbox'
                                  name='completed'
                                  defaultChecked={
                                      todo.completed || completedFetcher?.data?.completed
                                  }
                              />
                          </div>
                      </completedFetcher.Form>
                <Link
                  to={`/todos/${todo.id}/edit`}
                  className='flex items-center p-2 ml-4 mr-2 border-2 rounded hover:text-white text-blue-500 hover:bg-blue-500 border-blue-500'
                >
                  Edit
                </Link>
                <deleteFetcher.Form
                  method='delete'
                  action={`/todos/${todo.id}/delete`}
                >
                  <button className='flex p-2 ml-4 mr-2 border-2 rounded hover:text-white text-red-500 hover:bg-red-500 border-red-500'>
                    Delete
                  </button>
                </deleteFetcher.Form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
