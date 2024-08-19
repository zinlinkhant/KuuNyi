import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) { }

   
  @Post('signup')
  signUp(@Body() authDto: AuthDto) {
    return this.authService.signUp(authDto);
  }

  @Post('signin')
  signIn(
    @Body() authDto: AuthDto
  ) {
    return this.authService.signIn(authDto);
  }

      @UseGuards(JwtAuthGuard)
  @Get("user")
  getProfile(@Request() req) {
    return req.user;
  }
}
