// app/session.server.ts
import { Session, createCookieSessionStorage } from "@remix-run/node";

export type ToastMessage = {
  message: string;
  type: "success" | "error";
};
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: ["s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
