import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CurrentUser } from '@src/auth/decorator/current-user.decorator';
import { UserJwtPayload } from '@src/auth/types';
import { UserService } from '@src/user/user.service';
import { WorkspaceCreateDto } from './dto/workspace-create.dto';
import { WorkspaceService } from './workspace.service';

@Controller('/workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly userService: UserService,
  ) {}

  @Post()
  createWorkspace(@Body() data: WorkspaceCreateDto) {
    return this.workspaceService.createWorkspace(data);
  }

  @Get('/joined-workspaces')
  async findWorkspacesByUserId(@CurrentUser() user: UserJwtPayload) {
    const result = await this.userService.findWorkspacesByUserId(user.id);
    return result.workspaces;
  }

  @Get()
  findOneById(@Query('id') id: string, @Query('name') name: string) {
    if (name) return this.workspaceService.findWorkspaceByName(name);
    if (id) return this.workspaceService.findWorkspaceById(id);
    return this.workspaceService.findWorkspaces();
  }
}
