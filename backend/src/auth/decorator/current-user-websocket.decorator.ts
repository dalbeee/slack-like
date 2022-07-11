import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const WebsocketCurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const user = context.switchToWs().getClient().user;

    if (!user) throw new UnauthorizedException();
    return user;
  },
);
