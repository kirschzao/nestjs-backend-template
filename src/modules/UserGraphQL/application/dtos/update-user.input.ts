import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNumberString, IsOptional, IsString, Length } from 'class-validator';
import { RoleEnum } from '@/modules/User/domain/user.entity';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

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

  @Field(() => RoleEnum, { nullable: true })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}
