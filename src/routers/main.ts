import { Router } from "express";
import * as pingController from "../controllers/ping.js";
import * as authController from "../controllers/auth.js";
import * as tweetController from "../controllers/tweet.js";
import * as userController from "../controllers/user.js";
import { verifyJWT } from "../utils/jwt.js";

export const mainRouter = Router();

mainRouter.get("/ping", pingController.ping);
mainRouter.get("/privateping", verifyJWT, pingController.privateping);

mainRouter.post("/auth/signup", authController.signup);
mainRouter.post("/auth/signin", authController.signin);

mainRouter.post("/tweet", verifyJWT, tweetController.addTweet);
mainRouter.get("/tweet/:id", verifyJWT, tweetController.getTweet);
mainRouter.get("/tweet/:id/answers", verifyJWT, tweetController.getAnswers);
mainRouter.post("/tweet/:id/like", verifyJWT, tweetController.likeToogle);

mainRouter.get("/user/:slug", verifyJWT, userController.getUser);
mainRouter.get("/user/:slug/tweets", verifyJWT, userController.getUserTweets);
//mainRouter.post("/user/:slug/follow");
//mainRouter.put("/user");
//mainRouter.put("/user/avatar");
//mainRouter.put("/user/cover");

//mainRouter.get("/feed");
//mainRouter.get("/search");
//mainRouter.get("/trending");
//mainRouter.get("/suggestions");
