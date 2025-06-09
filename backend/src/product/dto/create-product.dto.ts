import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  // We use IsNumberString because data from a FormData object arrives as strings
  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @IsNumberString()
  @IsNotEmpty()
  quantity: string;
}