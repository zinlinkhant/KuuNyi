import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { addDays } from 'date-fns';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UserService,
    private config: ConfigService,
    private jwtService: JwtService
  ) { }

  
async signUp(authDto: AuthDto) {
  const { name, email, password } = authDto;
  await this.usersService.hasEmail(email);

  const hash = await bcrypt.hash(password, 10);

  const newUser = this.usersRepository.create({
    ...authDto,
    password: hash,
  });
  const result = await this.usersRepository.save(newUser);

  // Ensure the correct order of arguments: userId, email, and then name
  const access_token = await this.accessToken(result.id, result.name, result.email);

  delete result.password;
  return {
    ...result,
    expiredDate: this.expiredDate(),
    access_token,
  };
}
async signIn(
    authDto: AuthDto
  ) {
    const { email, password } = authDto;
    const user = await this.usersService.findOneWithEmail(email);
    if (!user) throw new UnauthorizedException('Credential Error');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credential Error');
    const access_token = await this.accessToken(user.id,user.name, user.email);
    delete user.password;
    return { ...user, access_token,expiredDate:this.expiredDate };
  }

  async accessToken(
    userId:number,
    name:string,
    email:string
  ){
    const payload = {
      sub: userId,
      name:name,
      email:email
    }
    const secretKey = this.config.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload,{
      expiresIn:'60d',
      secret: secretKey
    })
    return token
  }

  expiredDate(){
    const today = new Date();
    const tokenExpiredDate = addDays(today,90);
    return tokenExpiredDate;
  }
}
