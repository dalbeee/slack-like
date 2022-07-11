import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest()?.user;
    if (!user) throw new UnauthorizedException();
    return user;
  },
);
