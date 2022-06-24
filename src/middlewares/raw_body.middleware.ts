import { Injectable, NestMiddleware } from '@nestjs/common';
import { raw } from 'body-parser';
import { json } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    json({
      verify: (req: any, res, buffer, encoding) => {
        if (Buffer.isBuffer(buffer)) {
          const rawBody = Buffer.from(buffer);
          req['rawBody'] = rawBody;
        }
        return true;
      },
    })(req as any, res as any, next);
  }
}
