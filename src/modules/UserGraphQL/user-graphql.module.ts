import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserGqlResolver } from './infra/presentation/user-gql.resolver';
import { CreateUserGqlService } from './application/services/create-user-gql.service';
import { GetUserGqlService } from './application/services/get-user-gql.service';
import { GetAllUsersGqlService } from './application/services/get-all-users-gql.service';
import { UpdateUserGqlService } from './application/services/update-user-gql.service';
import { DeleteUserGqlService } from './application/services/delete-user-gql.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
    }),
  ],
  providers: [
    UserGqlResolver,
    CreateUserGqlService,
    GetUserGqlService,
    GetAllUsersGqlService,
    UpdateUserGqlService,
    DeleteUserGqlService,
  ],
})
export class UserGraphQLModule {}
