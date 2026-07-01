import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { slugify } from "../utils/slug.js";

interface GetBlogsQuery {
  page: number;
  take: number;
  sortOrder: string;
  sortBy: string;
  search: string;
}

interface CreateBlogBody {
  title: string;
  description: string;
  category: string;
  content: string;
  thumbnail: string;
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

export const getBlogBySlugService = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  if (!blog) {
    throw new ApiError("Blog not found!", 404);
  }

  return blog;
};

export const createBlogService = async (
  body: CreateBlogBody,
  userId: number,
) => {
  const blog = await prisma.blog.findUnique({
    where: { title: body.title },
  });

  if (blog) {
    throw new ApiError("Title already in use", 400);
  }

  const slug = slugify(body.title);

  await prisma.blog.create({
    data: {
      ...body,
      slug: slug,
      userId: userId,
    },
  });

  return { message: "create blog success" };
};
