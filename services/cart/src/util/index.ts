import axios from "axios";
import config from "../config";

export const PublishUserEvent = async (payload: {
  event: string;
  data: any;
}) => {
  axios.post(`${config.USER_SERVICE_URL}/events`, { payload }).catch((err) => {
    console.log("Could not publish user event: ");
    console.log(err.toString());
  });
};

export const CallUserServiceAuth = async (payload: { headers: any }) => {
  const reqConfig = {
    headers: {
      ...(payload.headers.authorization === undefined
        ? {}
        : { authorization: payload.headers.authorization }),
      ...(payload.headers["x-correlation-id"] === undefined
        ? {}
        : { "x-correlation-id": payload.headers["x-correlation-id"] }),
      ...(payload.headers["x-request-id"] === undefined
        ? {}
        : { "x-request-id": payload.headers["x-request-id"] }),
    },
  };
  return await axios.get(`${config.USER_SERVICE_URL}/user/auth`, reqConfig);
};

export const CallProductServiceUpdate = async (
  productId: string,
  qty: number,
  payload: { headers: any }
) => {
  const reqConfig = {
    headers: {
      ...(payload.headers.authorization === undefined
        ? {}
        : { authorization: payload.headers.authorization }),
      ...(payload.headers["x-correlation-id"] === undefined
        ? {}
        : { "x-correlation-id": payload.headers["x-correlation-id"] }),
      ...(payload.headers["x-request-id"] === undefined
        ? {}
        : { "x-request-id": payload.headers["x-request-id"] }),
    },
  };
  return await axios.post(
    `${config.PRODUCT_SERVICE_URL}/product/${productId}/cart`,
    { qty },
    reqConfig
  );
};
