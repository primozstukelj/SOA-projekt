import Kitten from "../database/models";
import { Cart } from "../database/models/Cart";
import { Product, ProductAttrs } from "../database/models/Product";
import ProductRepository from "../database/repository/product-repository";
import HttpException, { HttpCode } from "../exceptions/HttpException";
import { PublishUserEvent } from "../util";

class CartService {
  // repository: ProductRepository;

  constructor() {
    // this.repository = new ProductRepository();
  }

  AddProductToCart = async (
    userId: string,
    productId: string,
    qty: number,
    cartId?: string
  ) => {
    let cart;
    if (cartId) {
      cart = await Cart.findById(cartId);
      if (!cart) {
        throw new HttpException(HttpCode.NOT_FOUND, "Cart not found");
      }
      const isCartOwnedByUser = cart.userId === userId;
      if (!isCartOwnedByUser) {
        throw new HttpException(
          HttpCode.UNAUTHORIZED,
          "User can add product only to carts that he owns"
        );
      }
      await cart.updateOne({
        info: [{ product: productId, qty }, ...cart.info],
      });
    } else {
      cart = new Cart({ userId, info: [{ product: productId, qty }] });
      await cart.save();
    }

    return cart;
  };

  GetUserCarts = async (userId: string) => {
    const carts = await Cart.find({ userId });
    if (!carts) {
      throw new HttpException(HttpCode.NOT_FOUND, "User do not have carts");
    }
    return carts;
  };

  GetProductList = async () => {
    const productList = await Product.find();
    return productList;
  };

  RemoveProductFromCart = async (
    cartId: string,
    productId: string,
    userId: string
  ) => {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      throw new HttpException(HttpCode.NOT_FOUND, "Cart not found");
    }
    const isCartOwnedByUser = cart.userId === userId;
    if (!isCartOwnedByUser) {
      throw new HttpException(
        HttpCode.UNAUTHORIZED,
        "User can add product only to carts that he owns"
      );
    }
    // console.log(cart);
    const cartProduct = cart.info.find(
      ({ product }) => product.toString() === productId
    );
    if (!cartProduct) {
      throw new HttpException(
        HttpCode.NOT_FOUND,
        "Product does not exist in cart"
      );
    }
    const newInfo = cart.info.filter(
      ({ product }) => product.toString() !== productId
    );
    await cart.updateOne({ info: newInfo });
    return cartProduct;
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

export default CartService;
