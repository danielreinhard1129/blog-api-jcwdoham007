import "dotenv/config";
import { CorsOptions } from "cors";

console.log(process.env.BASE_URL_FE);


export const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://blog-api-jcwdoham007.vercel.app",
    process.env.BASE_URL_FE!,
  ],
  credentials: true,
};
