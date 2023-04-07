import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { AuthorizationError } from 'remix-auth'
import { badRequest, serverError } from 'remix-utils'
import { AuthForm } from '~/components/auth/auth-form'
import { SocialLoginForm } from '~/components/auth/social-login-form'
import { authenticator } from '~/server/auth.server'


export async function action({ request }: LoaderArgs) {
  try {
    return await authenticator.authenticate('register', request, {
      successRedirect: '/blog'
    })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof AuthorizationError)
      return badRequest({ message: error.message })
    return serverError(error)
  }
}

export default function Page() {
  return (
    <div>
      <AuthForm authType='register' />
      <SocialLoginForm>
        <div className='mt-2 mb-2 flex flex-col items-center justify-center md:mt-5 md:mb-5'>
          <h3 className='text-sm italic'>OR</h3>
          <Link to='/login'>
            <p className='text-sm italic'>Already have an account?? Login!</p>
          </Link>
        </div>
      </SocialLoginForm>
    </div>
  )
}
