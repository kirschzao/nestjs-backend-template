import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@/global/common/guards/jwt-auth.guard';
import { GetUser } from '@/global/common/decorators/get-user.decorator';
import { UpdateFileDTO } from '@/modules/File/application/dtos/update-file.dto';
import { ConvertToCreateFileDTO } from '@/modules/File/application/dtos/create-file.dto';
import {
  CreateFileDecorator,
  CreateFileKnowledgeDecorator,
  GetFileByAuthorIdDecorator,
  GetFileByIdDecorator,
  UpdateFileDecorator,
  DeleteFileDecorator,
  GetFileByIdN8NDecorator,
} from '@/modules/File/application/dtos/file.decorators';
import { CreateFileService } from '@/modules/File/application/services/create-file.service';
import { UpdateFileService } from '@/modules/File/application/services/update-file.service';
import { DeleteFileService } from '@/modules/File/application/services/delete-file.service';
import { GetFileByIdService } from '@/modules/File/application/services/get-file-by-id.service';
import { GetFilesByAuthorIdService } from '@/modules/File/application/services/get-file-by-author-id.service';
import { Public } from '@/global/common/decorators/public.decorator';
import { N8nGuard } from '@/global/common/guards/n8n.guard';

@ApiTags('File')
@UseGuards(JwtAuthGuard)
@Controller('file')
export class FileController {
  constructor(
    private readonly CreateFileService: CreateFileService,
    private readonly UpdateFileService: UpdateFileService,
    private readonly DeleteFileService: DeleteFileService,
    private readonly GetFileByIdService: GetFileByIdService,
    private readonly GetFilesByAuthorIdService: GetFilesByAuthorIdService,
  ) {}

  @CreateFileDecorator
  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 100 * 1024 * 1024 } }))
  @Post('')
  async create(@UploadedFiles() files: Array<Express.Multer.File>, @GetUser() user) {
    const creationPromises = files.map((file) => {
      const fileDTO = ConvertToCreateFileDTO(file);
      return this.CreateFileService.execute(fileDTO, String(user.id));
    });
    return await Promise.all(creationPromises);
  }

  @CreateFileKnowledgeDecorator
  @UseInterceptors(
    FilesInterceptor('files', 10, { limits: { fileSize: 1024 * 1024 * 1024 } }),
  )
  @Post('knowledge')
  async createInKnowledge(@UploadedFiles() files: Array<Express.Multer.File>, @GetUser() user) {
    const creationPromises = files.map((file) => {
      const fileDTO = ConvertToCreateFileDTO(file);
      return this.CreateFileService.execute(fileDTO, String(user.id));
    });
    return await Promise.all(creationPromises);
  }

  @GetFileByIdDecorator
  @Get(':id')
  async getFileById(@Param('id') id: string, @GetUser() user) {
    return await this.GetFileByIdService.execute(id, String(user.id));
  }

  @UseGuards(N8nGuard)
  @Public()
  @GetFileByIdN8NDecorator
  @Get('n8n/:id')
  async getFileByIdN8N(@Param('id') id: string, @Query('userId') userId: string) {
    return await this.GetFileByIdService.execute(id, userId);
  }

  @GetFileByAuthorIdDecorator
  @Get('user/:userId')
  async getFilesByAuthorId(@Param('userId') userId: string, @GetUser() user) {
    return await this.GetFilesByAuthorIdService.execute(userId, String(user.id));
  }

  @UpdateFileDecorator
  @Patch('')
  async updateFile(@GetUser() user, @Body() file: UpdateFileDTO) {
    return await this.UpdateFileService.execute(file, String(user.id));
  }

  @DeleteFileDecorator
  @Delete(':id')
  async deleteFile(@Param('id') id: string, @GetUser() user) {
    return await this.DeleteFileService.execute(id, String(user.id));
  }
}
