import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { WorkspaceCreateDto } from './dto/workspace-create.dto';
import { WorkspaceService } from './workspace.service';

@Controller('/workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  createWorkspace(@Body() data: WorkspaceCreateDto) {
    return this.workspaceService.createWorkspace(data);
  }

  @Get(':name')
  findWorkspaceChannelByName(@Param('name') name: string) {
    return this.workspaceService.findWorkspaceByName(name);
  }

  @Get()
  findWorkspaces() {
    return this.workspaceService.findWorkspaces();
  }
}
