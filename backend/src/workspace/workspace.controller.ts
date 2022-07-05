import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { WorkspaceCreateDto } from './dto/workspace-create.dto';
import { WorkspaceFindDto } from './dto/workspace-find.dto';
import { WorkspaceService } from './workspace.service';

@Controller('/workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  createWorkspace(@Body() data: WorkspaceCreateDto) {
    return this.workspaceService.createWorkspace(data);
  }

  // @Get(':id')
  // findWorkspaceChannelById() {}

  @Get(':name')
  findWorkspaceChannelByName(@Param('name') name: string) {
    return this.workspaceService.findWorkspaceByName(name);
  }

  // @Get()
  // findWorkspaces(@Query('name') name: string) {
  //   return this.workspaceService.findWorkspaces(name);
  // }
}
