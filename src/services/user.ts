import type { Prisma } from "../generated/prisma/index.js";
import { prisma } from "../utils/prisma.js";
import { getPublicURL } from "../utils/url.js";

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return {
      ...user,
      avatar: getPublicURL(user.avatar),
      cover: getPublicURL(user.cover),
    };
  }

  return null;
};

export const findUserBySlug = async (slug: string) => {
  const user = await prisma.user.findFirst({
    select: {
      avatar: true,
      cover: true,
      slug: true,
      name: true,
      bio: true,
      link: true,
    },
    where: { slug },
  });

  if (user) {
    return {
      ...user,
      avatar: getPublicURL(user.avatar),
      cover: getPublicURL(user.cover),
    };
  }

  return null;
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  const newUser = await prisma.user.create({ data });

  return {
    ...newUser,
    avatar: getPublicURL(newUser.avatar),
    cover: getPublicURL(newUser.cover),
  };
};

export const getUserFollowingCount = async (slug: string) => {
  const count = await prisma.follow.count({
    where: { user1Slug: slug },
  });
  return count;
};

export const getUserFollowersCount = async (slug: string) => {
  const count = await prisma.follow.count({
    where: { user2Slug: slug },
  });
  return count;
};

export const getUserTweetCount = async (slug: string) => {
  const count = await prisma.tweet.count({
    where: { userSlug: slug },
  });
  return count;
};

export const findTweetsByUser = async (
  slug: string,
  currentPage: number,
  perPage: number,
) => {
  const tweets = await prisma.tweet.findMany({
    include: {
      likes: {
        select: {
          userSlug: true,
        },
      },
    },
    where: { userSlug: slug, answerOf: 0 },
    orderBy: { createdAt: "desc" },
    skip: currentPage * perPage,
    take: perPage,
  });

  return tweets;
};
