import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UserEntity } from '../users/entities/user.entity';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>, // ✅ Fixed type

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // ✅ Create a notification and associate it with a user
  async create(createNotificationDto: CreateNotificationDto, user: UserEntity) {
    if (
      !createNotificationDto.message ||
      createNotificationDto.message.trim() === ''
    ) {
      throw new Error('Notification message cannot be empty.');
    }

    const notification = this.notificationRepository.create({
      user, // ✅ Associate with user
      message: createNotificationDto.message,
    });

    return await this.notificationRepository.save(notification);
  }

  // ✅ Get all notifications for the authenticated user
  async findAll(userId: number): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find({
      where: { user: { id: userId } }, // ✅ Corrected
      order: { timestamp: 'DESC' },
    });
  }

  async remove(id: number, userId: number): Promise<NotificationEntity> {
    // Find the notification for the specific user
    const notification = await this.notificationRepository.findOne({
      where: { id, user: { id: userId } }, // Ensure the user can only delete their own notification
    });

    if (!notification) {
      throw new Error(
        'Notification not found or you are not authorized to delete it',
      );
    }

    // Proceed with deletion
    await this.notificationRepository.remove(notification);

    return notification; // Optionally return the deleted notification
  }
}
