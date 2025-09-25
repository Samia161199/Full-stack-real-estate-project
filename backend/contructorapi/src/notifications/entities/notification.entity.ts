import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { PropertyEntity } from 'src/properties/entities/property.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => UserEntity, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @ManyToOne(() => PropertyEntity, (property) => property.notifications, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  property: PropertyEntity;
}
