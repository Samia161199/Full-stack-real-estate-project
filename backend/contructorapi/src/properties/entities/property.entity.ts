import { NotificationEntity } from 'src/notifications/entities/notification.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('properties')
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  price: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  listedIn: string;

  @Column('simple-array', { nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @ManyToOne(() => UserEntity, (user) => user.properties)
  addedBy: UserEntity;

  @OneToMany(
    () => NotificationEntity,
    (notification) => notification.property,
    {
      cascade: true,
    },
  )
  notifications: NotificationEntity[];
}
