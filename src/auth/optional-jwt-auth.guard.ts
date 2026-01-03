import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Override handleRequest to make authentication optional
  handleRequest(err: any, user: any) {
    // If there's no user or error, just return null instead of throwing
    return user || null;
  }

  // Always return true so the route handler is called
  canActivate(context: ExecutionContext) {
    // Try to activate, but don't fail if it doesn't work
    return super.canActivate(context) as Promise<boolean> | boolean;
  }
}
