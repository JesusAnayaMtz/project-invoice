import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Request() req) {
    return this.auth.me(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  updateProfile(@Body() dto: UpdateProfileDto, @Request() req) {
    return this.auth.updateProfile(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('me/password')
  changePassword(@Body() dto: ChangePasswordDto, @Request() req) {
    return this.auth.changePassword(req.user.id, dto);
  }
}
