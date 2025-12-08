import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/global/common/guards/jwt-auth.guard';
import { CreateUserService } from '@/modules/User/application/services/create-user.service';
import { UpdateUserService } from '@/modules/User/application/services/update-user.service';
import { GetAllUserService } from '@/modules/User/application/services/get-all-user.service';
import { DeleteUserService } from '@/modules/User/application/services/delete-user.service';
import { GetUserWithAccountService } from '@/modules/User/application/services/get-user-with-account.service';
import { GetUserByIdService } from '@/modules/User/application/services/get-user.service';
import { CreateUserDTO } from '@/modules/User/application/dtos/create-user.dto';
import { UpdateUserDTO } from '@/modules/User/application/dtos/update-user.dto';
import { GetUser } from '@/global/common/decorators/get-user.decorator';
import {
  CreateUserDecorator,
  UpdateUserDecorator,
  GetAllUsersDecorator,
  GetUserDecorator,
  DeleteUserDecorator,
  GetUserWithAccountDecorator,
  DeleteUserPhoneDecorator,
} from '../../application/dtos/user.decorator';
import { IsAdmin } from '@/global/common/decorators/is-admin-decorator';
import { DeleteUserDTO } from '../../application/dtos/delete-user.dto';
import { DeleteUserPhoneService } from '@/modules/User/application/services/delete-user-phone.service';
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiTags('User')
export class UserController {
  constructor(
    private readonly CreateUserService: CreateUserService,
    private readonly UpdateUserService: UpdateUserService,
    private readonly GetAllUserService: GetAllUserService,
    private readonly GetUserWithAccountService: GetUserWithAccountService,
    private readonly GetUser: GetUserByIdService,
    private readonly DeleteUserPhoneService: DeleteUserPhoneService,
    private readonly DeleteUserService: DeleteUserService,
  ) {}

  @CreateUserDecorator
  @IsAdmin()
  @Post()
  async createUser(@Body() user: CreateUserDTO) {
    return await this.CreateUserService.execute(user);
  }

  @GetUserDecorator
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.GetUser.execute(id);
  }

  @GetAllUsersDecorator
  @IsAdmin()
  @Get()
  async getAllUsers() {
    return await this.GetAllUserService.execute();
  }

  @GetUserWithAccountDecorator
  @Get('account/:id')
  async getUserWithAccount(@Param('id') id: string, @GetUser() user) {
    return await this.GetUserWithAccountService.execute(String(user.id));
  }

  @UpdateUserDecorator
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDTO) {
    return await this.UpdateUserService.execute(id, user);
  }

  @DeleteUserPhoneDecorator
  @Post('phone')
  async deleteUserPhone(@GetUser() user) {
    return await this.DeleteUserPhoneService.execute(String(user.id));
  }

  @DeleteUserDecorator
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @GetUser() user, @Body() payload: DeleteUserDTO) {
    return await this.DeleteUserService.execute(id, String(user.id), payload.password);
  }
}
