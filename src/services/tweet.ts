import { prisma } from "../utils/prisma.js";
import { getPublicURL } from "../utils/url.js";

export const findTweet = async (id: number) => {
  const tweet = await prisma.tweet.findFirst({
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
          slug: true,
        },
      },
      likes: {
        select: {
          userSlug: true,
        },
      },
    },

    where: { id },
  });

  if (tweet) {
    tweet.user.avatar = getPublicURL(tweet.user.avatar);
    return tweet;
  }
  return null;
};

export const createTweet = async (
  slug: string,
  body: string,
  answer?: number,
) => {
  const newTweet = await prisma.tweet.create({
    data: {
      body,
      userSlug: slug,
      answerOf: answer ?? 0,
    },
  });
  return newTweet;
};

export const findAnswersFromTweet = async (id: number) => {
  const tweets = await prisma.tweet.findMany({
    include: {
      user: {
        select: {
          name: true,
          avatar: true,
          slug: true,
        },
      },
      likes: {
        select: {
          userSlug: true,
        },
      },
    },
    where: { answerOf: id },
  });

  for (const tweet of tweets) {
    if (tweet.user) {
      tweet.user.avatar = getPublicURL(tweet.user.avatar);
    }
  }
  return tweets;
};
