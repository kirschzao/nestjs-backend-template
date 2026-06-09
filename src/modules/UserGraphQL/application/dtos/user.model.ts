import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { RoleEnum } from '@/modules/User/domain/user.entity';

registerEnumType(RoleEnum, { name: 'RoleEnum' });

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  cpf?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  createdAt: Date;

  @Field(() => RoleEnum)
  role: RoleEnum;
}
