import {
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const userRoles = request?.logger?.roles || []; // Assuming roles are in `logger.roles`

      const hasRole = allowedRoles.some((role) => userRoles.includes(role));
      if (hasRole) return true;

      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
  }
  return mixin(RolesGuardMixin);
};
