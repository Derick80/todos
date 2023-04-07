import { useMatches } from '@remix-run/react'
import { useMemo } from 'react'
import type { ZodError, ZodSchema } from 'zod'

type ActionErrors<T> = Partial<Record<keyof T, string>>

export async function validateAction<ActionInput>({
  request,
  schema
}: {
  request: Request
  schema: ZodSchema
}) {
  const body = Object.fromEntries(await request.formData()) as ActionInput

  try {
    const formData = schema.parse(body) as ActionInput
    return { formData, errors: null }
  } catch (error) {

    const errors = error as ZodError<ActionInput>

    return {
      formData: body,
      errors: errors.issues.reduce((acc: ActionErrors<ActionInput>, curr) => {
        const key = curr.path[0] as keyof ActionInput

        acc[key] = curr.message
        return acc
      }, {})
    }
  }
}
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches()
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  )
  return route?.data
}

type UserType = {
  id: string
  email: string
  username: string
  avatarUrl?: string
}

function isUser(user: any): user is UserType {
  return user && typeof user === 'object' && typeof user.email === 'string'
}

export function useOptionalUser(): UserType | undefined {
  const data = useMatchesData('root')
  if (!data || !isUser(data.user)) {
    return undefined
  }
  return data.user
}
