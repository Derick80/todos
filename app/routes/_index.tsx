import type { V2_MetaFunction } from "@remix-run/node";
import { Form, Link } from '@remix-run/react'
import { useOptionalUser } from '~/server/helpers'

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  const user = useOptionalUser()
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <ul>
{user ? (
          <li>
         Welcome back,   {user.username}
            </li>
        ) :null
          }
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
      <li>
        <Link to="/todos">Todos</Link>
      </li>
      <li>
        <Form method="post" action="/logout">
          <button type="submit">Logout</button>
        </Form>
      </li>
      </ul>
    </div>
  );
}
