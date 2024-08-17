import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongoDB from "./config/mongodb";
import authRoutes from "./modules/auth/routes/authRoutes";
import profileRoutes from "./modules/profile/routes/profileRoutes";
import workFlowRoutes from "./modules/workflow/routes/workFlowRoutes";
import talesRoutes from "./modules/tales/routes/talesRoutes";
import feedbackRoutes from "./modules/feedback/routes/feedbackRoutes";
import reactionRoutes from "./modules/reactions/routes/reactionRoutes";
import shareRoutes from "./modules/share/routes/shareRoutes";
import linkRoutes from "./modules/links/routes/linkRoutes";
import repoRoutes from "./modules/repo/routes/repoRoutes";

import errorHandler from "./shared/middlware/errorHandler";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
connectToMongoDB();

app.use(express.json());

// Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/profile", profileRoutes);
app.use("/v1/workflow", workFlowRoutes);
app.use("/v1/tales", talesRoutes);
app.use("/v1/feedback", feedbackRoutes);
app.use("/v1/reaction", reactionRoutes);
app.use("/v1/share", shareRoutes);
app.use("/v1/links", linkRoutes);
app.use("/v1/connect", repoRoutes);

// ERROR HANDLER MIDDLEWARE - should be used LAST only always
app.use(errorHandler);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
