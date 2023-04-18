import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { isAuthenticated } from "~/server/auth.server";

export async function loader({ request }: LoaderArgs) {
  const user = await isAuthenticated(request);
  if (!user) {
    return redirect("/login");
  }
  return json({ user });
}

export default function BetaHome() {
  return (
    <div>
      <h1>Beta</h1>
    </div>
  );
}
