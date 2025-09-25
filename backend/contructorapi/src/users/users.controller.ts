/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { Logger } from 'src/utility/decorators/logger.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyEntity } from 'src/properties/entities/property.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { UserForgetPasswordDto } from './dto/user-forgetPassword.dto';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
  ) {}

  //SIGNUP_____________________________
  @Post('register')
  async signup(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signup(userSignUpDto) };
  }

  //SIGNIN________________________________
  @Post('signin')
  async signin(@Body() userSignInDto: UserSignInDto, @Res() res: Response) {
    const user = await this.usersService.signin(userSignInDto);
    const accessToken = await this.usersService.accessToken(user);

    // Set the cookie with the access token
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === 'production'? true : false,  // Secure in production
      sameSite: 'strict', 
    });

    return res.json({ message: 'Login successful' });
  }

  //FORGETPASSWORD________________________________
  @Post('forgetpassword')
  async forgetpassword(@Body() userForgetPasswordDto: UserForgetPasswordDto, @Res() res: Response) {
    try {
       const user = await this.usersService.forgetpassword(userForgetPasswordDto);
       const accessToken = await this.usersService.accessToken(user);
       await this.usersService.sendTokenToEmail(user.email, accessToken);
       return res.json({ message: 'Access token sent to your email!' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  

  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return await this.usersService.findOne(+id);
  }
  /*
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
*/
@UseGuards(AuthenticationGuard)
  @Get('profile')
  async getProfile(@Logger() logger: UserEntity) {
    // Fetch the properties for the authenticated user
    const properties = await this.propertyRepository.find({
      where: {
        addedBy: { id: logger.id },
      },
      relations: ['addedBy'],
    });

    return {
      user: logger,
      properties: properties,
    };
  }


}
