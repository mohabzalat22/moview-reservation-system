import bcrypt from "bcrypt";

import type { CreateUser, UpdateUser } from "../dto/user.dto";

import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    return this.userRepository.findAll();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async createUser(data: CreateUser) {
    const userExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }

  async updateUser(email: string, data: UpdateUser) {
    const userExists = await this.userRepository.findByEmail(email);

    if (!userExists) {
      throw new Error("Couldn't find the user with this email");
    }

    // Hash password if it's being updated
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }

    const updatedUser = await this.userRepository.update(email, data);

    return updatedUser;
  }

  async deleteUserByEmail(email: string) {
    const userExists = await this.userRepository.findByEmail(email);

    if (!userExists) {
      throw new Error("Couldn't find the user with this email");
    }

    return this.userRepository.deleteByEmail(email);
  }
}
