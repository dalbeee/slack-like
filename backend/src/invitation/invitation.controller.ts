import { Body, Controller, Param, Post } from '@nestjs/common';

import { InvitationCreateDto } from './dto/invitation-create.dto';
import { InvitationService } from './invitation.service';

@Controller('/:workspace')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  createInvitation(
    @Param('workspace') workspaceId: string,
    @Body() data: InvitationCreateDto,
  ) {
    return this.invitationService.createInvitations({ ...data, workspaceId });
  }
}
