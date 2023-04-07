import { Form, useSearchParams } from '@remix-run/react'

type Props = {
  authType: 'register' | 'login'
}

const actionMap: Record<Props['authType'], { button: string; url: string }> = {
  register: {
    url: '/register',
    button: 'Register'
  },
  login: {
    url: '/login',
    button: 'Login'
  }
}

export const AuthForm = ({ authType }: Props) => {
  const [searchParams] = useSearchParams()
  const { button, url } = actionMap[authType]

  const token = searchParams.get('token')

  return (
    <Form
      className='mx-auto flex w-full flex-col items-center justify-center'
      method='post'
      action={url}
    >
      <input type='hidden' name='token' value={token || ''} />

      <>
        <label className='text-sm text-zinc-900 dark:text-slate-200'>
          Email
        </label>
        <input
          className='rounded-xl p-2 text-black shadow-md'
          id='email'
          name='email'
          type='email'
          placeholder='youremail@mail.com'
        />
        <label>Username</label>
        <input
          className='rounded-xl p-2 text-black shadow-md'
          id='username'
          name='username'
          type='text'
          placeholder='username'
        />
      </>

      <>
        <label>Password</label>
        <input
          className='rounded-xl p-2 text-black shadow-md'
          id='password'
          name='password'
          type='password'
          autoComplete='current-password'
          placeholder='********'
        />
      </>

      <button className='mt-5' type='submit'>
        {button}
      </button>
    </Form>
  )
}
