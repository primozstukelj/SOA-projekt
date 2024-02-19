import mongoose from "mongoose";

export interface ProductAttrs {
  name: string;
  description: string;
  price: number;
  picture: string;
  userId: string;
  count: number;
}

export interface ProductDoc extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  picture: string;
  userId: string;
  count: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
  deleteById: (id: string) => Promise<void>;
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  }
  // {
  //   toJSON: {
  //     transform(doc, ret) {
  //       ret.id = ret._id;
  //       delete ret._id;
  //     },
  //   },
  // }
);

productSchema.statics.build = (attrs: ProductAttrs) => new Product(attrs);

productSchema.statics.deleteById = function (_id: string) {
  return this.deleteOne({ _id });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
