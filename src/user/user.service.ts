import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Example method to create a new user
  async createUser(name: string, email: string, password: string): Promise<User> {
    const newUser = this.userRepository.create({ name, email, password });
    return this.userRepository.save(newUser);
  }

  // Example method to find all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
