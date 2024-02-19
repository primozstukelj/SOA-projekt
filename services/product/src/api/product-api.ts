import { Express, NextFunction, Request, Response } from "express";
import authMiddleware from "../middleware/auth.middleware";
import ProductService from "../service/product-service";

const ProductAPI = (app: Express) => {
  const productService = new ProductService();

  app.post(
    "/product",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          name,
          description,
          price,
          picture,
          authUserId: userId,
          count,
        } = req.body;
        const result = await productService.CreateProduct({
          name,
          description,
          price,
          picture,
          userId,
          count,
        });
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/product",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await productService.GetProductList();
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/product/user",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { authUserId } = req.body;
        const result = await productService.GetUsersProduct(authUserId);
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/product/:productId",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const productId = req.params.productId;
        const result = await productService.GetProduct(productId);
        return res.status(200).json({ result });
      } catch (error) {
        next(error);
      }
    }
  );

  app.put(
    "/product/:productId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { productId } = req.params;
        const { authUserId, ...payload } = req.body;
        await productService.UpdateProduct(productId, authUserId, payload);
        return res.status(200).json({ msg: "Product was updated" });
      } catch (error) {
        next(error);
      }
    }
  );

  app.delete(
    "/product/:productId",
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { productId } = req.params;
        const { authUserId } = req.body;
        const result = await productService.DeleteProduct(
          productId,
          authUserId
        );
        return res.status(200).json({ msg: "Product was deleted" });
      } catch (error) {
        next(error);
      }
    }
  );
  app.post(
    "/product/:productId/cart",
    // authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { productId } = req.params;
        const { qty } = req.body;
        await productService.UpdateProductCount(productId, qty);
        return res.status(200).json({ msg: "Product count decreased" });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get(
    "/ping-user",
    async (req: Request, res: Response, next: NextFunction) => {
      await productService.PingUserService();
      return res.status(200).json({ msg: "Pinged user service" });
    }
  );
};

export default ProductAPI;
