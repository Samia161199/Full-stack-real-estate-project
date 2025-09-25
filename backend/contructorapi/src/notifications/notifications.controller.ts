import { Controller, Post, Get, Body, Delete, UseGuards, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Logger } from 'src/utility/decorators/logger.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  //Create Notification
  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Logger() logger: UserEntity,
  ) {
    return this.notificationsService.create(createNotificationDto, logger);
  }

  //@UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER]))
  @Get()
  async getNotifications(@Logger() logger: UserEntity) {
    const notifications = await this.notificationsService.findAll(logger.id);

    return {
      user: logger, // Return user data
      notifications: notifications, // Return the notifications
    };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.USER])) // Guard to check if user is authorized
  @Delete(':id')
  async deleteNotification(
    @Param('id') id: number,
    @Logger() logger: UserEntity,
  ) {
    try {
      // Call service method to delete the notification
      const deletedNotification = await this.notificationsService.remove(
        id,
        logger.id,
      );

      return {
        message: 'Notification deleted successfully',
        notification: deletedNotification,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
