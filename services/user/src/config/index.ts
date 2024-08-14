import dotenv from "dotenv";
import joi from "joi";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, `../../.env`) });
}

const envVarsSchema = joi
  .object()
  .keys({
    NODE_ENV: joi.string().valid("production", "dev").required(),
    SECRET: joi.string().required().description("My api secret"),
    DB: joi.string().required().description("Mongo db uri"),
    PORT: joi.number().positive().required(),
    RABBITMQ_URL: joi.string().required().description("RabbitMQ url"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  NODE_ENV: <string>envVars.NODE_ENV,
  PORT: <number>envVars.PORT,
  SECRET: <string>envVars.SECRET,
  DB: <string>envVars.DB,
  RABBITMQ_URL: <string>envVars.RABBITMQ_URL,
};
