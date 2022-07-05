import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WorkspaceCreateDto } from './dto/workspace-create.dto';
import { WorkspaceService } from './workspace.service';

@Controller('/workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  createWorkspace(@Body() data: WorkspaceCreateDto) {
    return this.workspaceService.createWorkspace(data);
  }

  @Get()
  findWorkspaces(@Query('name') name: string) {
    return this.workspaceService.findWorkspaces(name);
  }
}
