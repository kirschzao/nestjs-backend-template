import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ServerOptions } from 'socket.io';
import { Socket } from 'socket.io';
import { RefreshTokenPayload } from '@/global/common/strategies/refresh-token-payload.dto';

export class SocketIoAdapter extends IoAdapter {
  constructor(private app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const allowedOrigins = getCorsOrigins();

    const serverOptions = {
      ...options,
      cors: {
        origin: allowedOrigins,
        credentials: true,
      },
    };

    const server = super.createIOServer(port, serverOptions);
    return server;
  }
}

function getCorsOrigins(): string[] {
  const corsEnv = process.env.CORS;
  if (!corsEnv) {
    return ['http://localhost:5173'];
  }
  return corsEnv.split(',');
}

export interface AuthenticatedSocket extends Socket {
  user: RefreshTokenPayload;
}
