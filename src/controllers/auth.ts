import type { RequestHandler } from "express";
import { signupSchema } from "../schemas/signup.js";
import { findUserByEmail, findUserBySlug } from "../services/user.js";
import slug from "slug";

export const signup: RequestHandler = async (req, res) => {
  const safeData = signupSchema.safeParse(req.body);
  if (!safeData.success) {
    return res.json({ error: safeData.error.flatten().fieldErrors });
  }

  const hasEmail = await findUserByEmail(safeData.data.email);
  if (hasEmail) {
    return res.json({ error: "Email ja cadastrado" });
  }

  let genSlug = true;
  let userSlug = slug(safeData.data.name);
  while (genSlug) {
    const hasSlug = await findUserBySlug(userSlug);
    if (hasSlug) {
      let slugSuffix = Math.floor(Math.random() * 999999).toString();
      userSlug = slug(safeData.data.name + slugSuffix);
    } else {
      genSlug = false;
    }
  }

  res.json({});
};
