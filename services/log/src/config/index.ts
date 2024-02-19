import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const cfg = `./.env`;
  dotenv.config({ path: cfg });
}

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  DB: process.env.DB,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
  STATS_URL: process.env.STATS_URL
};
