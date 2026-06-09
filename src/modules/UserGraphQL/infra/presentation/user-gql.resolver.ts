import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserModel } from '@/modules/UserGraphQL/application/dtos/user.model';
import { CreateUserInput } from '@/modules/UserGraphQL/application/dtos/create-user.input';
import { UpdateUserInput } from '@/modules/UserGraphQL/application/dtos/update-user.input';
import { CreateUserGqlService } from '@/modules/UserGraphQL/application/services/create-user-gql.service';
import { GetUserGqlService } from '@/modules/UserGraphQL/application/services/get-user-gql.service';
import { GetAllUsersGqlService } from '@/modules/UserGraphQL/application/services/get-all-users-gql.service';
import { UpdateUserGqlService } from '@/modules/UserGraphQL/application/services/update-user-gql.service';
import { DeleteUserGqlService } from '@/modules/UserGraphQL/application/services/delete-user-gql.service';
import { GqlAuthGuard } from '@/modules/UserGraphQL/infra/guards/gql-auth.guard';
import { GqlAdminGuard } from '@/modules/UserGraphQL/infra/guards/gql-admin.guard';
import { GqlGetUser } from '@/modules/UserGraphQL/infra/decorators/gql-get-user.decorator';

@Resolver(() => UserModel)
@UseGuards(GqlAuthGuard)
export class UserGqlResolver {
  constructor(
    private readonly CreateUserGqlService: CreateUserGqlService,
    private readonly GetUserGqlService: GetUserGqlService,
    private readonly GetAllUsersGqlService: GetAllUsersGqlService,
    private readonly UpdateUserGqlService: UpdateUserGqlService,
    private readonly DeleteUserGqlService: DeleteUserGqlService,
  ) {}

  @Query(() => UserModel, { name: 'user' })
  async getUser(@Args('id', { type: () => ID }) id: string) {
    return this.GetUserGqlService.execute(id);
  }

  @Query(() => [UserModel], { name: 'users' })
  @UseGuards(GqlAdminGuard)
  async getUsers() {
    return this.GetAllUsersGqlService.execute();
  }

  @Mutation(() => UserModel)
  @UseGuards(GqlAdminGuard)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.CreateUserGqlService.execute(input);
  }

  @Mutation(() => UserModel)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
    @GqlGetUser('sub') authenticatedUserId: string,
  ) {
    return this.UpdateUserGqlService.execute(id, input, authenticatedUserId);
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
    @GqlGetUser('sub') authenticatedUserId: string,
  ) {
    return this.DeleteUserGqlService.execute(id, authenticatedUserId);
  }
}
