import type { Response } from "express";
import type { ExtendedRequest } from "../types/extended-request.js";
import { addTweetSchema } from "../schemas/add-tweet.js";
import {
  createTweet,
  findAnswersFromTweet,
  findTweet,
} from "../services/tweet.js";
import { addHashtag } from "../services/trend.js";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
  const safeData = addTweetSchema.safeParse(req.body);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  if (safeData.data.answer) {
    const hasAnsweredTweet = await findTweet(parseInt(safeData.data.answer));
    if (!hasAnsweredTweet) {
      return res.json({ error: "Tweet original não encontrado" });
    }
  }

  const newTweet = await createTweet(
    req.userSlug as string,
    safeData.data.body,
    safeData.data.answer ? parseInt(safeData.data.answer!) : 0,
  );

  const hashtags = safeData.data.body.match(/#[a-zA-Z0-9_]+/g);
  if (hashtags) {
    for (let hashtag of hashtags) {
      if (hashtag.length >= 2) {
        await addHashtag(hashtag);
      }
    }
  }

  res.json({ tweet: newTweet });
};

export const getTweet = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "ID é obrigatório" });

  const tweet = await findTweet(parseInt(id as string));
  if (!tweet) return res.json({ error: "Tweet não encontrado" });

  res.json({ tweet });
};

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
  const { id } = req.params;

  const answers = await findAnswersFromTweet(parseInt(id as string));

  res.json({ answers });
};
