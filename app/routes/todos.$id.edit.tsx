import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { isAuthenticated } from "~/server/auth.server";
import { validateAction } from "~/server/helpers";
import { prisma } from "~/server/prisma.server";

export async function loader({ request, params }: LoaderArgs) {
  const user = await isAuthenticated(request);
  if (!user) {
    return redirect("/login");
  }
  const { id } = params;
  if (!id) {
    throw new Error("Id is required");
  }

  const todo = await prisma.todo.findUnique({
    where: {
      id,
    },
  });
  if (!todo) {
    throw new Error("Todo not found");
  }

  return json({ todo });
}
export const schema = z.object({
  title: z.string().min(1, "Title must be at least 1 character long"),
  description: z
    .string()
    .min(1, "Description must be at least 1 character long"),
  completed: z.coerce.boolean(),
});

export type ActionInput = z.infer<typeof schema>;

export async function action({ request, params }: ActionArgs) {
  const user = await isAuthenticated(request);
  if (!user) {
    throw new Error("You must be logged in to create a todo");
  }

  const { id } = params;
  if (!id) {
    throw new Error("Id is required");
  }

  const { formData, errors } = await validateAction({ request, schema });

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  const { title, description, completed } = formData as ActionInput;
  await prisma.todo.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      completed,
    },
  });
  return redirect("/todos");
}

export type ActionData = {
  todo?: typeof prisma.todo;
  errors?: {
    title?: string;
    description?: string;
    completed?: string;
  };
};
export default function EditRoute() {
  const { todo } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>() as ActionData;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1>Edit Todo</h1>
      <Form method="post" className="flex flex-row items-center gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          <input
            className="mr-4 w-full appearance-none rounded px-3 py-2 text-gray-500 shadow"
            type="text"
            name="title"
            defaultValue={todo.title}
          />
          {actionData?.errors?.title && <p>{actionData.errors.title}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="description">Description</label>
          <input
            className="mr-4 w-full appearance-none rounded px-3 py-2 text-gray-500 shadow"
            type="text"
            name="description"
            defaultValue={todo.description}
          />
          {actionData?.errors?.description && (
            <p>{actionData.errors.description}</p>
          )}
        </div>

        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="completed">Completed</label>

            <input
              type="checkbox"
              name="completed"
              defaultChecked={todo.completed}
            />
          </div>
          {actionData?.errors?.completed && (
            <p>{actionData.errors.completed}</p>
          )}
          <button
            type="submit"
            className="rounded border-2 border-teal-500 p-2 text-teal-500 hover:bg-teal-700 hover:text-white"
          >
            Save
          </button>
        </div>
      </Form>
    </div>
  );
}
