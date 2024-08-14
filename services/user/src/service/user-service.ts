import User, { IUser } from "../database/models/User";
import UserRepository from "../database/repository/user-repository";
import HttpException, { HttpCode } from "../exceptions/HttpException";
import config from "../config";
import ms from "ms";
import jwt from "jsonwebtoken";
import { IJWTToken } from "../interfaces/token-interface";

class UserService {
  repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  CreateUser = async (payload: {
    email: string;
    password: string;
  }) => {
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      throw new HttpException(HttpCode.BAD_REQUEST, "Invalid email");
    }

    const newUser = new User({ ...payload });
    return await newUser.save();
    // return User.create({
    //   ...payload,
    // });
  };

  LoginUser = async (payload: { email: string; password: string }) => {
    const existingUser = await User.findOne({ email: payload.email });
    if (!existingUser) {
      throw new HttpException(HttpCode.BAD_REQUEST, "Invalid email");
    }

    if (!existingUser.isPasswordValid(payload.password)) {
      throw new HttpException(HttpCode.BAD_REQUEST, "Invalid password.");
    }
    console.log("login config.SECRET", config.SECRET);
    // generate JWT token and save it to db
    const jwtToken = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        name: `${existingUser.firstName} ${existingUser.lastName}`,
      },
      config.SECRET ?? "super-secret",
      {
        issuer: "somone",
        subject: existingUser.id,
        expiresIn: ms(60 * 60000 /* 1 hour */),
      }
    );
    await existingUser.updateOne({
      session: {
        token: jwtToken,
        isExpired: false,
      },
    });
    return jwtToken;
  };

  AuthUser = async (token: string): Promise<string> => {
    console.log("auth config.SECRET", config.SECRET);
    const decodedToken = jwt.verify(
      token,
      config.SECRET ?? "super-secret",
      (err: any, decoded: any) => {
        if (err)
          throw new HttpException(
            HttpCode.UNAUTHORIZED,
            "Token is invalid or expired"
          );
        return decoded;
      }
    );
    const { id } = decodedToken! as unknown as IJWTToken;
    const existingUser = await User.findOne({ _id: id });

    if (!existingUser) {
      throw new HttpException(HttpCode.BAD_REQUEST, "Unknown user");
    }
    const tokensMatch = existingUser.session.token === token;
    if (!tokensMatch) {
      throw new HttpException(HttpCode.UNAUTHORIZED, "Invalid token");
    }
    return id;
  };

  GetUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
      throw new HttpException(HttpCode.NOT_FOUND, "User not found");
    }
    return user;
  };

  GetUserList = async () => {
    const userList = await User.find();
    return userList;
  };

  UpdateUser = async (id: string, payload: Partial<IUser>) => {
    const user = await User.findById(id);
    if (!user) {
      throw new HttpException(HttpCode.NOT_FOUND, "User not found");
    }
    const result = await user.updateOne(payload);
    const isUpdated = result.modifiedCount === 1;
    if (!isUpdated) {
      throw new HttpException(
        HttpCode.INTERNAL_SERVER_ERROR,
        "Something went wrong"
      );
    }
  };

  DeleteUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
      throw new HttpException(HttpCode.NOT_FOUND, "User not found");
    }
    await user.deleteOne();
  };
}

export default UserService;
