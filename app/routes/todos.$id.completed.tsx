import { ActionArgs, json, redirect } from '@remix-run/node'
import { z } from 'zod'
import { isAuthenticated } from '~/server/auth.server'
import { validateAction } from '~/server/helpers'
import { prisma } from '~/server/prisma.server'


export const schema = z.object({
    completed: z.coerce.boolean()
})

export type ActionInput = z.infer<typeof schema>
export async function action({request, params}:ActionArgs){

    const user = await isAuthenticated(request)
    if(!user){
        throw new Error("You must be logged in to create a todo");
    }

    const {id} = params
    const {formData, errors} = await validateAction({request, schema})

    if(errors){
        return json({errors}, {status: 400})
    }

    const {completed} = formData as ActionInput

    await prisma.todo.update({
        where: {
            id
        },
        data: {
            completed
        }
    })
    return redirect('/todos')
}