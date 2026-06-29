import { Prisma, User } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";

interface GetUsersQuery {
  page: number;
  take: number;
  sortOrder: string; // asc or desc
  sortBy: string; // based on column
  search: string;
}

export const getUsersService = async (query: GetUsersQuery) => {
  const { page, take, sortOrder, sortBy, search } = query;

  const whereClause: Prisma.UserWhereInput = {
    deletedAt: null,
  };

  if (search) {
    whereClause.email = { contains: search, mode: "insensitive" };
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    include: { addresses: true },
    omit: { password: true },
    skip: (page - 1) * take,
    take: take,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.user.count({ where: whereClause });

  return {
    data: users,
    meta: {
      page: page,
      take: take,
      total: total,
    },
  };
};

export const getUserService = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new ApiError("User not found!", 404);
  }

  return user;
};

export const createUserService = async (body: User) => {
  await prisma.$transaction(async (tx) => {
    // process 1
    const newUser = await tx.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
        role: "USER",
      },
    });

    // process 2
    await tx.address.create({
      data: {
        street: "Jl. Soekarno Hatta",
        city: "Jakarta",
        userId: newUser.id,
      },
    });
  });

  return { message: "create user success" };
};

export const updateUserService = async (id: number, body: Partial<User>) => {
  await getUserService(id);

  await prisma.user.update({
    where: { id: id },
    data: body,
  });

  return { message: "update user success" };
};

export const deleteUserService = async (id: number) => {
  await getUserService(id);

  // hard delete
  // await prisma.user.delete({
  //   where: { id: id },
  // });

  // soft delete
  await prisma.user.update({
    where: { id: id },
    data: { deletedAt: new Date() },
  });

  return { message: "delete user success" };
};
