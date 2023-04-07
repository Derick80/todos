import { ActionArgs, json } from "@remix-run/node";
import { isAuthenticated } from "~/server/auth.server";
import { prisma } from "~/server/prisma.server";

export async function action({ request, params }: ActionArgs) {
  const user = await isAuthenticated(request);
  if (!user) {
    throw new Error("You must be logged in to create a todo");
  }

  await prisma.todo.delete({
    where: {
      id: params.id,
    },
  });

  return json({
    success: true,
  });
}
