import type { Response } from "express";
import type { ExtendedRequest } from "../types/extended-request.js";
import {
  findUserBySlug,
  getUserFollowersCount,
  getUserFollowingCount,
  getUserTweetCount,
} from "../services/user.js";

export const getUser = async (req: ExtendedRequest, res: Response) => {
  const { slug } = req.params;

  const user = await findUserBySlug(slug as string);
  if (!user) return res.json({ error: "Usuário não encontrado" });

  const followingCount = await getUserFollowingCount(user.slug);
  const followersCount = await getUserFollowersCount(user.slug);
  const tweetCount = await getUserTweetCount(user.slug);

  res.json({ user, followingCount, followersCount, tweetCount });
};
