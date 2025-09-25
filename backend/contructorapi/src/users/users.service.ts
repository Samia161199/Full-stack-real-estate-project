import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { UserForgetPasswordDto } from './dto/user-forgetPassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  //SIGNUP______________________________________________________
  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findUserByEmail(userSignUpDto.email);

    if (userExists) throw new BadRequestException('Email is already exist');

    userSignUpDto.password = await hash(userSignUpDto.password, 10);
    let user = this.usersRepository.create(userSignUpDto);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  //SIGNIN___________________________________________________________
  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignInDto.email })
      .getOne();

    if (!userExists) {
      throw new BadRequestException({ message: 'User is not found' });
    }
    const matchPassword = await compare(
      userSignInDto.password,
      userExists.password,
    );

    if (!matchPassword) {
      throw new BadRequestException({ message: 'wrong password' });
    }

    delete userExists.password;
    return userExists;
  }

  //ForgetPassword__________________________________________
  async forgetpassword(
    userForgetPasswordDto: UserForgetPasswordDto,
  ): Promise<UserEntity> {
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .where('users.email = :email', { email: userForgetPasswordDto.email })
      .getOne();

    if (!userExists) {
      throw new BadRequestException({ message: 'User is not found' });
    }

    return userExists;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
  /*
  remove(id: number) {
    return `This action removes a #${id} user`;
  }*/

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
  }

  // Send access token link to email
  async sendTokenToEmail(email: string, token: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail account
      },
    });

    // Email content with the token as a clickable link
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Sign-In Link',
      html: `
        <p>Click the link below to sign in:</p>
        <a href="http://localhost:3000/authenticate?token=${token}">Sign In</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
  }
  catch(error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email'); // This is what you’re seeing in the frontend
  }
}
