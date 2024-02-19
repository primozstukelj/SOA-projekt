import { Product, ProductAttrs } from "../database/models/Product";
import HttpException, { HttpCode } from "../exceptions/HttpException";
import { PublishUserEvent } from "../util";

class ProductService {
  // repository: ProductRepository;

  constructor() {
    // this.repository = new ProductRepository();
  }

  CreateProduct = async (payload: ProductAttrs) => {
    const product = Product.build({
      ...payload,
    });

    await product.save();

    return product;
  };

  GetProduct = async (id: string) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new HttpException(HttpCode.NOT_FOUND, "Product not found");
    }
    return product;
  };

  GetUsersProduct = async (userId: string) => {
    const product = await Product.find({ userId });
    if (!product) {
      throw new HttpException(HttpCode.NOT_FOUND, "Product not found");
    }
    return product;
  };

  GetProductList = async () => {
    const productList = await Product.find();
    return productList;
  };

  UpdateProduct = async (
    productId: string,
    userId: string,
    payload: Partial<ProductAttrs>
  ) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new HttpException(HttpCode.NOT_FOUND, "Product not found");
    }

    const isProductOwnByUser = product.userId === userId;
    if (!isProductOwnByUser) {
      throw new HttpException(
        HttpCode.UNAUTHORIZED,
        "You can update only product that you own"
      );
    }
    const result = await product.updateOne(payload);
    const isUpdated = result.modifiedCount === 1;
    if (!isUpdated) {
      throw new HttpException(
        HttpCode.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  };

  UpdateProductCount = async (productId: string, qty: number) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new HttpException(HttpCode.NOT_FOUND, "Product not found");
    }
    if (qty > product.count) {
      throw new HttpException(
        HttpCode.BAD_REQUEST,
        `Only ${product.count} products left`
      );
    }

    const result = await product.updateOne({ count: product.count - qty });
    const isUpdated = result.modifiedCount === 1;
    if (!isUpdated) {
      throw new HttpException(
        HttpCode.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  };

  DeleteProduct = async (productId: string, userId: string) => {
    const product = await Product.findById(productId);
    if (!product) {
      throw new HttpException(HttpCode.NOT_FOUND, "Product not found");
    }

    const isProductOwnByUser = product.userId === userId;
    if (!isProductOwnByUser) {
      throw new HttpException(
        HttpCode.UNAUTHORIZED,
        "You can delete only product that you own"
      );
    }
    const result = await product.deleteOne();
    return result;
  };

  ReceivePing = async (data: any) => {
    console.log("Your service just got pinged:");
    console.log(data);
  };

  PingUserService = async () => {
    const payload = {
      event: "PING",
      data: { msg: "Hello from product service" },
    };
    PublishUserEvent(payload);
  };

  SubcribeEvents = async (payload: { event: string; data: any }) => {
    if (!payload || !payload.event || !payload.data) {
      console.log("Could not subscribe an event due to invalid payload");
      return;
    }
    const { event, data } = payload;

    //Do some event related things
    switch (event) {
      case "PING":
        this.ReceivePing(data);
        break;
      default:
        break;
    }
  };
}

export default ProductService;
