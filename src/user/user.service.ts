import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<any> {
    return this.userRepository.find({ where: { name:username } });
  }

  async create(username: string, password: string): Promise<any> {
    const newUser = { userId: Date.now(), username, password };
    this.userRepository.save(newUser);
    return newUser;
  }
   async findOneWithEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
    async hasEmail(email: string) {
    const hasEmail = await this.findOneWithEmail(email);
    if (hasEmail) throw new ConflictException('Email has exist');
  }
}
