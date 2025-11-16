import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    const isProduction = process.env.NODE_ENV === 'production';

    if (!token) {
      // Em produção, bloquear acesso sem token
      if (isProduction) {
        console.error('[AuthGuard] No token provided in production mode');
        throw new UnauthorizedException('No authentication token provided');
      }
      // Em desenvolvimento, permitir acesso com usuário mock
      console.warn('[AuthGuard] Development mode: allowing access without token');
      request.user = { clerkUserId: 'dev-user-no-auth' };
      return true;
    }

    try {
      const sessionClaims: any = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      request.user = { clerkUserId: sessionClaims?.sub };
      console.log(`[AuthGuard] Token verified for user: ${sessionClaims?.sub}`);
      return true;
    } catch (error) {
      // Em produção, bloquear se falhar a verificação
      if (isProduction) {
        console.error('[AuthGuard] Token verification failed in production:', error.message);
        throw new UnauthorizedException('Invalid authentication token');
      }
      // Em desenvolvimento, permitir mesmo se Clerk não estiver configurado
      console.warn('[AuthGuard] Development mode: token verification failed, allowing access');
      request.user = { clerkUserId: 'dev-user-no-clerk' };
      return true;
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }
}

