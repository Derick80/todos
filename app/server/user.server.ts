import type { Prisma } from "@prisma/client";

import { prisma } from "./prisma.server";
import { createPasswordHash } from "./auth-service.server";

export const createUser = async (
  input: Prisma.UserCreateInput & {
    password?: string;
    avatarUrl?: string;
    account?: Omit<Prisma.AccountCreateInput, "user">;
  }
) => {
  const data: Prisma.UserCreateInput = {
    email: input.email,
    username: input.username,
  };

  if (input.password) {
    data.password = await createPasswordHash(input.password);
  }

  if (input.account) {
    data.account = {
      create: [
        {
          provider: input.account.provider,
          providerAccountId: input.account.providerAccountId,
          accessToken: input.account.accessToken,
          refreshToken: input.account.refreshToken,
        },
      ],
    };
  }

  const user = await prisma.user.create({
    data,
    select: {
      password: false,
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      account: true,
    },
  });

  return user;
};

export const getUser = async (input: Prisma.UserWhereUniqueInput) => {
  const user = await prisma.user.findUnique({
    where: input,
    select: {
      password: false,
      id: true,
      email: true,
      username: true,
      avatarUrl: true,
      account: true,
    },
  });
  return user;
};

export const getUserPasswordHash = async (
  input: Prisma.UserWhereUniqueInput
) => {
  const user = await prisma.user.findUnique({
    where: input,
  });
  if (user) {
    return {
      user: { ...user, password: null },
      passwordHash: user.password,
    };
  }
  return { user: null, passwordHash: null };
};
