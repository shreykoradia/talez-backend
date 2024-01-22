import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToMongoDB from "./config/mongodb";
import authRoutes from "./modules/auth/routes/authRoutes";
import profileRoutes from "./modules/profile/routes/profileRoutes";
import workFlowRoutes from "./modules/workflow/routes/workFlowRoutes";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
connectToMongoDB();

app.use(express.json());

app.use("/v1/auth", authRoutes);
app.use("/v1/profile", profileRoutes);
app.use("/v1/workflow", workFlowRoutes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
