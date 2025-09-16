import { ExecutionContext, Injectable } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Request } from 'express';

@Injectable()
export class CacheKeyInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { id: string };

    if (!user) {
      return undefined;
    }

    const query = Object.keys(request.query)
      .sort()
      .map((key) => {
        const value = request.query[key];

        const stringifiedValue = JSON.stringify(value);

        return `${key}=${stringifiedValue}`;
      })
      .join('&');

    return `tasks:${user.id}:${query}`;
  }
}
