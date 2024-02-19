import axios from "axios";
import { Express, NextFunction, Request, Response } from "express";
import HttpException, { HttpCode } from "../exceptions/HttpException";
import authMiddleware from "../middleware/auth.middleware";
import CartService from "../service/cart-service";
import { CallProductServiceUpdate } from "../util";

const CartAPI = (app: Express) => {
  const cartService = new CartService();

  app.post(
    "/cart",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { productId, authUserId, qty } = req.body;
        const response = await CallProductServiceUpdate(productId, qty, {
          headers: req.headers,
        }).catch((err) => {
          if (err.response.headers["x-correlation-id"]) {
            res.set(
              "X-Correlation-ID",
              err.response.headers["x-correlation-id"]
            );
          }
          if (axios.isAxiosError(err) && err.response) {
            return {
              status: err.response.status,
              data: err.response.data.message,
            };
          }
          throw new HttpException(
            HttpCode.INTERNAL_SERVER_ERROR,
            err.toString()
          );
        });
        if (response.status !== HttpCode.OK) {
          throw new HttpException(response.status, response.data);
        }
        const result = await cartService.AddProductToCart(
          authUserId,
          productId,
          qty
        );
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/cart",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { authUserId } = req.body;

        const result = await cartService.GetUserCarts(authUserId);
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.post(
    "/cart/:cartId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { productId, authUserId, qty } = req.body;
        const { cartId } = req.params;
        const response = await CallProductServiceUpdate(productId, qty, {
          headers: req.headers,
        }).catch((err) => {
          if (err.response.headers["x-correlation-id"]) {
            res.set(
              "X-Correlation-ID",
              err.response.headers["x-correlation-id"]
            );
          }
          if (axios.isAxiosError(err) && err.response) {
            return {
              status: err.response.status,
              data: err.response.data.message,
            };
          }
          throw new HttpException(
            HttpCode.INTERNAL_SERVER_ERROR,
            err.toString()
          );
        });
        if (response.status !== HttpCode.OK) {
          throw new HttpException(response.status, response.data);
        }
        const result = await cartService.AddProductToCart(
          authUserId,
          productId,
          qty,
          cartId
        );
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/cart/:cartId/product/:productId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { authUserId } = req.body;
        const { cartId, productId } = req.params;
        const removedProduct = await cartService.RemoveProductFromCart(
          cartId,
          productId,
          authUserId
        );
        const qty = -removedProduct.qty;
        const response = await CallProductServiceUpdate(productId, qty, {
          headers: req.headers,
        }).catch((err) => {
          if (err.response.headers["x-correlation-id"]) {
            res.set(
              "X-Correlation-ID",
              err.response.headers["x-correlation-id"]
            );
          }
          if (axios.isAxiosError(err) && err.response) {
            return {
              status: err.response.status,
              data: err.response.data.message,
            };
          }
          throw new HttpException(
            HttpCode.INTERNAL_SERVER_ERROR,
            err.toString()
          );
        });
        if (response.status !== HttpCode.OK) {
          throw new HttpException(response.status, response.data);
        }
        return res.status(200).json({ result: removedProduct });
      } catch (error) {
        next(error);
      }
    }
  );

  // app.get(
  //   "/product",
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const result = await cartService.GetProductList();
  //       return res.status(200).json({ result });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  // app.get(
  //   "/product/user",
  //   authMiddleware,
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const { authUserId } = req.body;
  //       const result = await cartService.GetUsersProduct(authUserId);
  //       return res.status(200).json({ result });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  // app.get(
  //   "/product/:productId",
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const productId = req.params.productId;
  //       const result = await cartService.GetProduct(productId);
  //       return res.status(200).json({ result });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  // app.put(
  //   "/product/:productId",
  //   authMiddleware,
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const { productId } = req.params;
  //       const { authUserId, ...payload } = req.body;
  //       await cartService.UpdateProduct(productId, authUserId, payload);
  //       return res.status(200).json({ msg: "Product was updated" });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  // app.delete(
  //   "/product/:productId",
  //   authMiddleware,
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //       const { productId } = req.params;
  //       const { authUserId } = req.body;
  //       const result = await cartService.DeleteProduct(productId, authUserId);
  //       return res.status(200).json({ msg: "Product was deleted" });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );

  app.get(
    "/ping-user",
    async (req: Request, res: Response, next: NextFunction) => {
      await cartService.PingUserService();
      return res.status(200).json({ msg: "Pinged user service" });
    }
  );
};

export default CartAPI;
