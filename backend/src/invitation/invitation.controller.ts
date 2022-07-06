import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { InvitationActivateDto } from './dto/invitation-activate.dto';
import { InvitationCreateDto } from './dto/invitation-create.dto';
import { InvitationService } from './invitation.service';

@Controller('/invitations')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  test() {
    return true;
  }
  @Post('/create-invitations')
  createInvitations(@Body() data: InvitationCreateDto) {
    console.log(data);
    return this.invitationService.createInvitations(data);
  }

  @Get('/expired-date-check')
  isValidExpiredDate(@Query('code') activateCode: string) {
    return this.invitationService.isValidExpiredDate(activateCode);
  }

  @Get('/user-join-validation')
  hasWorkspaceJoinedUser(@Query('code') activateCode: string) {
    return this.invitationService.hasWorkspaceJoinedUser(activateCode);
  }

  @Post('/activation')
  async activateInvitations(@Body() data: InvitationActivateDto) {
    return await this.invitationService.activateInvitations(data);
  }
}
