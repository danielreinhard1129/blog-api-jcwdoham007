import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";

interface GetBlogsQuery {
  page: number;
  take: number;
  sortOrder: string;
  sortBy: string;
  search: string;
}

export const getBlogsService = async (query: GetBlogsQuery) => {
  const { page, take, sortOrder, sortBy, search } = query;

  const whereClause: Prisma.BlogWhereInput = {};

  if (search) {
    whereClause.title = { contains: search, mode: "insensitive" };
  }

  const blogs = await prisma.blog.findMany({
    where: whereClause,
    skip: (page - 1) * take,
    take: take,
    orderBy: { [sortBy]: sortOrder },
    include: { user: { select: { name: true } } },
  });

  const total = await prisma.blog.count({ where: whereClause });

  return {
    data: blogs,
    meta: {
      page: page,
      take: take,
      total: total,
    },
  };
};
