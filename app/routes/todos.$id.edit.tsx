import { ActionArgs, LoaderArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { isAuthenticated } from '~/server/auth.server'
import { validateAction } from '~/server/helpers'
import { prisma } from '~/server/prisma.server'

export async function loader ({ request, params }: LoaderArgs) {
    const user = await isAuthenticated(request)
    if (!user) {
        return redirect('/login')
    }

    const todo = await prisma.todo.findUnique({
        where: {
            id: params.id
        }
    })
    if (!todo) {
        throw new Error("Todo not found")
    }


    return json({ todo })

}
export const schema = z.object({
    title: z.string().min(1, "Title must be at least 1 character long"),
    description: z.string().min(1, "Description must be at least 1 character long"),
    completed: z.coerce.boolean()
})

export type ActionInput = z.infer<typeof schema>

export async function action ({ request, params }: ActionArgs) {
    const user = await isAuthenticated(request)
    if (!user) {
        throw new Error("You must be logged in to create a todo")
    }

    const { formData, errors } = await validateAction({ request, schema })

    if (errors) {
        return json({ errors }, { status: 400 })
    }

    const { title, description, completed } = formData as ActionInput
    await prisma.todo.update({
        where: {
            id: params.id
        },
        data: {
            title,
            description,
            completed
        }
    })
    return redirect('/todos')

}

export type ActionData = {
    todo?: typeof prisma.todo
    errors?: {
        title?: string
        description?: string
        completed?: string
    }
}
export default function EditRoute () {
    const { todo } = useLoaderData<typeof loader>()
    const actionData = useActionData<typeof action>() as ActionData

    return (
        <div
            className='flex flex-col gap-2 items-center justify-center'
        >
            <h1>Edit Todo</h1>
            <Form method="post"
                className='flex flex-row gap-2 items-center'
            >
                <div className='flex flex-col gap-2'>
                    <label htmlFor="title">Title</label>
                    <input
                        className='shadow appearance-none rounded w-full py-2 px-3 mr-4 text-gray-500'
                        type="text" name="title" defaultValue={ todo.title } />
                    { actionData?.errors?.title && <p>{ actionData.errors.title }</p> }
                </div>
                <div className='flex flex-col gap-2'>
                    <label

                        htmlFor="description">Description</label>
                    <input
                        className='shadow appearance-none rounded w-full py-2 px-3 mr-4 text-gray-500'
                        type="text" name="description" defaultValue={ todo.description } />
                    { actionData?.errors?.description && <p>{ actionData.errors.description }</p> }
                </div>


                <div className='flex flex-row gap-2 items-center'>
                    <div className='flex flex-col gap-2'>
                        <label

                            htmlFor="completed">Completed</label>

                        <input

                            type="checkbox" name="completed" defaultChecked={ todo.completed } />
                    </div>
                    { actionData?.errors?.completed && <p>{ actionData.errors.completed }</p> }
                    <button type="submit"
                        className='p-2 border-2 rounded text-teal-500 border-teal-500 hover:text-white hover:bg-teal-700'
                    >Save</button>
                </div>
            </Form>
        </div>
    )


}
