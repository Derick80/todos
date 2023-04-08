import type { Prisma, Todo } from "@prisma/client";
import * as Checkbox from "@radix-ui/react-checkbox";
import type { ActionArgs, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  Outlet,
  useActionData,
  useFetcher,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import React from "react";
import { isAuthenticated } from "~/server/auth.server";
import { prisma } from "~/server/prisma.server";
import { SearchBar } from "~/components/search-bar";

export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request);
  if (!user) {
    return redirect("/login");
  }

  const url = new URL(request.url);
  const filter = url.searchParams.get("filter");

  let textFilter: Prisma.TodoWhereInput = {};

  if (filter) {
    textFilter = {
      completed: {
        equals: filter === "completed",
      },
    };
  }

  const todos = await prisma.todo.findMany({
    where: {
      userId: user.id,
      ...textFilter,
    },
    orderBy: {
      completed: "asc",
    },
  });

  return json({ todos });
}

export async function action({ request, params }: ActionArgs) {
  const user = await isAuthenticated(request);
  if (!user) {
    throw new Error("You must be logged in to create a todo");
  }

  return json({
    success: true,
  });
}
export default function TodosHome() {
  const [done, setDone] = React.useState(false);
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const deleteFetcher = useFetcher();
  const completedSubmit = useSubmit();
  const completedFetcher = useFetcher();
  function handleCompletedChange(event: React.ChangeEvent<HTMLFormElement>) {
    completedSubmit(event.currentTarget, {
      replace: true,
    });
  }

  return (
    <div className="grid-rows-auto flex grid-cols-12 flex-col gap-3 md:grid p-1">
      <div className="col-span-4 col-start-5 flex flex-col items-center p-1">
        <h1 className="items-center text-2xl">ToDo</h1>
        <Outlet />
        <div className="flex fle items-center gap-4 p-1">
          <Counter data={ data.todos } />

          <Link
            to="/todos/new"
            className="rounded-md border-2 border-green-500 px-3 py-2 text-green-500 hover:bg-green-700  hover:text-white"
          >
            New
          </Link>
          <SearchBar />
        </div>
        <div className="flex flex-col items-center gap-2">
          <ul className="w-screen">
            {data.todos.map((todo) => (
              <li
                className={
                  todo.completed === true
                    ? "mt-4  flex items-center justify-between gap-2 overflow-hidden rounded-md border p-2 line-through shadow-md"
                    : "mt-4  flex items-center justify-between gap-2 overflow-hidden rounded-md border p-2 shadow-md"
                }
                key={todo.id}
              >

                  <h3 className="flex-wrap">{todo.title}</h3>



                <div className="flex flex-row gap-2">
                  <completedFetcher.Form
                    method="POST"
                    action={`/todos/${todo.id}/completed`}
                    onChange={handleCompletedChange}
                    className="flex flex-col justify-center gap-2"
                  >
                    <div className="flex">
                      <Checkbox.Root
                        className="border-white dark:border-green-500  flex h-6 w-6 items-center justify-center  border-2"
                        id="c1"
                        name="completed"
                        defaultChecked={
                          todo.completed || completedFetcher?.data?.completed
                        }
                        onClick={() => setDone(!done)}
                      >
                        <Checkbox.Indicator className="w-full">
                          {todo.completed || completedFetcher?.data?.completed
                            ? "✅"
                            : null}
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                    </div>
                  </completedFetcher.Form>
                  <Link
                    to={`/todos/${todo.id}/edit`}
                    className="ml-4 mr-2 flex items-center rounded border-2 border-blue-500 p-2 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    Edit
                  </Link>
                  <deleteFetcher.Form
                    method="delete"
                    action={`/todos/${todo.id}/delete`}
                  >
                    <button className="ml-4 mr-2 flex rounded border-2 border-red-500 p-2 text-red-500 hover:bg-red-500 hover:text-white">
                      Delete
                    </button>
                  </deleteFetcher.Form>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Counter({ data: todos }: { data: SerializeFrom<Partial<Todo>>[] }) {
  return (
    <div className="flex flex-row items-center gap-4 p-1">
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg">Completed</p>
        {todos.filter((todo) => todo.completed).length} / {todos.length}
      </div>

      <div className="flex flex-col items-center gap-1">
        <p className="text-lg">Pending</p>
        {todos.filter((todo) => !todo.completed).length} / {todos.length}
      </div>
    </div>
  );
}
