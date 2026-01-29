import type { Response } from "express";
import type { ExtendedRequest } from "../types/extended-request.js";
import {
  findTweetsByUser,
  findUserBySlug,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
} from "../services/user.js";
import { userTweetsSchema } from "../schemas/user-tweets.js";

export const getUser = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const user = await findUserBySlug(slug as string);
  if (!user) return res.json({ error: "Usuário não encontrado" });

  const followingCount = await getUserFollowingCount(user.slug);
  const followersCount = await getUserFollowersCount(user.slug);
  const tweetCount = await getUserTweetCount(user.slug);

  res.json({ user, followingCount, followersCount, tweetCount });
};

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const safeData = userTweetsSchema.safeParse(req.query);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  let perPage = 10;
  let currentPage = safeData.data.page ?? 0;

  const tweets = await findTweetsByUser(slug as string, currentPage, perPage);

  res.json({ tweets, page: currentPage });
};
