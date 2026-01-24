import { prisma } from "../utils/prisma.js";

export const addHashtag = async (hashtag: string) => {
  const hs = await prisma.trend.findFirst({
    where: { hashtag },
  });
  if (hs) {
    await prisma.trend.update({
      where: { id: hs.id },
      data: { counter: hs.counter + 1, updateAt: new Date() },
    });
  } else {
    await prisma.trend.create({
      data: { hashtag },
    });
  }
};
