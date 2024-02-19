import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

const SALT_WORK_FACTOR = 10;

export enum Gender {
  male = "male",
  female = "female",
  undisclosed = "undisclosed",
}

export interface Address extends Document {
  street: string;
  city: string;
  postCode: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  session?: {
    token: string;
    isExpired: boolean;
  };
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  password: { type: String, required: true },
  session: {
    token: { type: String },
    isExpired: { type: Boolean },
  },
  // Gets the Mongoose enum from the TypeScript enum
  //   gender: { type: String, enum: Object.values(Gender) },
  //   address: {
  //     street: { type: String },
  //     city: { type: String },
  //     postCode: { type: String }
  //   }
});
UserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (
  plaintext: string,
  callback: any
) {
  return callback(null, bcrypt.compareSync(plaintext, this.password));
};

UserSchema.methods.generateHash = function (password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR));
};

UserSchema.methods.isPasswordValid = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

// Omit the password when returning a user
UserSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

// Export the model and return your IUser interface
export default mongoose.model(/*<IUser>*/ "User", UserSchema);
