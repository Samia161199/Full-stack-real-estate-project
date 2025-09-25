import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { PropertyEntity } from './entities/property.entity';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { Logger } from 'src/utility/decorators/logger.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 10 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Logger() user: UserEntity, // Assuming user is injected here
  ) {
    if (files?.images) {
      createPropertyDto.images = files.images.map((file) => file.filename);
    }
    return this.propertiesService.create(createPropertyDto, user);
  }

  @Get('dashboard/all')
  async findAll(): Promise<PropertyEntity[]> {
    return await this.propertiesService.findAll();
  }

  @Get('dashboard/:id')
  async findOne(@Param('id') id: number): Promise<PropertyEntity> {
    return await this.propertiesService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @Logger() user: UserEntity, // Assuming user is injected here
  ) {
    return this.propertiesService.update(+id, updatePropertyDto, user);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Logger() user: UserEntity,
  ): Promise<string> {
    const property = await this.propertiesService.findOne(+id);
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }
    await this.propertiesService.remove(+id, user);
    return `Property with ID ${id} has been successfully removed.`;
  }
}
