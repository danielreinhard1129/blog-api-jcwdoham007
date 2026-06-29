import express from "express";
import { userRoutes } from "./routes/user.routes.js";
import { globalError, notFoundError } from "./utils/errors.js";

const PORT = 8000;

const app = express();

// configs
app.use(express.json()); // agar bisa menerima req.body

// entry point
app.use("/users", userRoutes);

// errors
app.use(globalError);
app.use(notFoundError);

app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});

// pigiri3887@googxs.com
