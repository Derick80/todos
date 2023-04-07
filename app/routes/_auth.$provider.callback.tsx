// app/routes/auth/$provider.callback.tsx
import type { LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/server/auth.server";

export let loader = ({ request, params }: LoaderArgs) => {
  const provider = params.provider as string;
  return authenticator.authenticate(provider, request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
};
