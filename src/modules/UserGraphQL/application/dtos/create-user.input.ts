import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { RoleEnum } from '@/modules/User/domain/user.entity';

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumberString()
  @Length(11, 11)
  cpf?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumberString()
  @Length(11, 11)
  phone?: string;

  @Field(() => RoleEnum)
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role: RoleEnum;
}
