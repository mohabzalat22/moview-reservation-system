import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { generateToken } from "../utils/jwt";
import { DBUser } from "../dto/user.dto";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
  async register(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.userRepository.create({
      name,
      email,
      role: "USER", //default
      password: hashedPassword,
    });

    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    const user = (await this.userRepository.findByEmail(email)) as DBUser;

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    };
  }
}
