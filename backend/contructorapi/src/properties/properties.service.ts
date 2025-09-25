import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyEntity } from './entities/property.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsService } from 'src/notifications/notifications.service'; // Inject NotificationsService

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,

    private readonly notificationsService: NotificationsService, // Inject NotificationsService
  ) {}

  // Create property and send notification
  async create(
    createPropertyDto: CreatePropertyDto,
    user: UserEntity,
  ): Promise<PropertyEntity> {
    const property = this.propertyRepository.create({
      ...createPropertyDto,
      addedBy: user,
    });

    const savedProperty = await this.propertyRepository.save(property);

    // Trigger notification after creating the property
    await this.notificationsService.create(
      {
        message: `"${savedProperty.title}" has been created.`,
        userId: user.id, // Use the correct user ID here
      },
      user,
    );

    return this.formatPropertyImages(savedProperty);
  }

  // Get all properties
  async findAll(): Promise<PropertyEntity[]> {
    const properties = await this.propertyRepository.find({
      relations: ['addedBy'],
    });
    return properties.map(this.formatPropertyImages);
  }

  // Get a single property by id
  async findOne(id: number): Promise<PropertyEntity> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['addedBy'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found.`);
    }

    return this.formatPropertyImages(property);
  }

  // Update property and send notification
  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
    user: UserEntity, // Add user for notification
  ): Promise<PropertyEntity> {
    const property = await this.findOne(id);
    Object.assign(property, updatePropertyDto);

    const updatedProperty = await this.propertyRepository.save(property);

    // Trigger notification after updating the property
    await this.notificationsService.create(
      {
        message: `"${updatedProperty.title}" has been updated.`,
        userId: user.id, // Use the correct user ID here
      },
      user,
    );

    return this.formatPropertyImages(updatedProperty);
  }

  // Remove property and send notification
  async remove(id: number, user: UserEntity): Promise<void> {
    const property = await this.findOne(id);
    await this.propertyRepository.remove(property);

    // Trigger notification after removing the property
    await this.notificationsService.create(
      {
        message: `"${property.title}" has been deleted.`,
        userId: user.id, // Use the correct user ID here
      },
      user,
    );
  }

  /**
   * Ensures images are full URLs before sending the response.
   */
  private formatPropertyImages(property: PropertyEntity): PropertyEntity {
    if (property.images && property.images.length > 0) {
      property.images = property.images.map((image) =>
        image.startsWith('http')
          ? image
          : `${process.env.BASE_URL}/uploads/${image}`,
      );
    }
    return property;
  }
}
