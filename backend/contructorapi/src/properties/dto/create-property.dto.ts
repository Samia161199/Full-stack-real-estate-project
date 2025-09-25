import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreatePropertyDto {
  @IsNotEmpty({ message: 'Property title is missing' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Property description is missing' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Property location is missing' })
  @IsString()
  location: string;

  @IsNotEmpty({ message: 'Property price is missing' })
  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  listedIn?: string;

  @IsOptional()
  @IsString({ each: true }) // Ensures an array of strings
  images?: string[];
}
