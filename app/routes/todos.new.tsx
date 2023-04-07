import { ActionArgs, json, redirect } from "@remix-run/node";
import { Form, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { isAuthenticated } from "~/server/auth.server";
import { z } from "zod";
import { validateAction } from "~/server/helpers";
import { prisma } from "~/server/prisma.server";

export const schema = z.object({
  title: z
    .string()
    .min(1, "Title must be more than 1 character long")
    .max(80, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description must be more than 1 character long")
    .max(80, "Description must be less than 100 characters"),
});

export type ActionInput = z.infer<typeof schema>;

export async function action({ request }: ActionArgs) {
  const user = await isAuthenticated(request);
  if (!user) {
    throw new Error("You must be logged in to create a todo");
  }

  const { formData, errors } = await validateAction({ request, schema });

  if (errors) {
    return json({ errors }, { status: 400 });
  }

  const { title, description } = formData as ActionInput;

  try {
    await prisma.todo.create({
      data: {
        title,
        description,
        completed: false,
        userId: user.id,
      },
    });
    redirect("/todos");
  } catch (err) {
    return json({ errors: err }, { status: 400 });
  }
}

export default function NewRoute() {
  return (
    <div className="flex flex-col gap-2">
      <Form method="post" className="flex flex-row items-center gap-2">
        <label htmlFor="title">Title</label>
        <input
          className="mr-4 w-full appearance-none rounded px-3 py-2 text-gray-500 shadow"
          type="text"
          name="title"
          placeholder="...add Todo title"
        />
        <label htmlFor="description">Description</label>
        <input
          className="mr-4 w-full appearance-none rounded px-3 py-2 text-gray-500 shadow"
          type="text"
          placeholder="...add description"
          name="description"
        />
        <button
          type="submit"
          className="rounded border-2 border-teal-500 p-2 text-teal-500 hover:bg-teal-700 hover:text-white"
        >
          Add
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }
}
