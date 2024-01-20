import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/routes/authRoutes";
import profileRoutes from "./modules/profile/routes/profileRoutes";

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 4001;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.use("/v1/auth", authRoutes);
app.use("/v1/profile", profileRoutes);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
