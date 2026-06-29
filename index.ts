import express from "express";
import { userRoutes } from "./routes/user.routes.js";
import { globalError, notFoundError } from "./utils/errors.js";
import { authRoutes } from "./routes/auth.routes.js";
import cors from "cors";

const PORT = 8000;

const app = express();

// configs
app.use(cors());
app.use(express.json()); // agar bisa menerima req.body

// entry point
app.use("/users", userRoutes);
app.use("/auth", authRoutes);

// errors
app.use(globalError);
app.use(notFoundError);

app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});

// pigiri3887@googxs.com
