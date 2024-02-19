import dotenv from "dotenv";
import joi from "joi";
import path from "path";

if(process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, `../../.env`) });
}

const envVarsSchema = joi
  .object()
  .keys({
    NODE_ENV: joi.string().required().description("Node eviroment"),
    DB: joi.string().required().description("Mongo db uri"),
    PORT: joi.number().positive().required(),
    PRODUCT_SERVICE_URL: joi
      .string()
      // .valid("http://localhost:8003", "http://product-service:8003")
      .required(),
    USER_SERVICE_URL: joi
      .string()
      // .valid("http://localhost:8001", "http://user-service:8001")
      .required(),
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
  DB: <string>envVars.DB,
  PRODUCT_SERVICE_URL: <string>envVars.PRODUCT_SERVICE_URL,
  USER_SERVICE_URL: <string>envVars.USER_SERVICE_URL,
  RABBITMQ_URL: <string>envVars.RABBITMQ_URL
};
