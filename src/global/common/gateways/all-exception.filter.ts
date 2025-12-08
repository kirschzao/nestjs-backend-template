import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class AllExceptionsFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    let errorResponse: object;

    if (exception instanceof WsException) {
      errorResponse = {
        name: exception.name,
        details: exception.getError(),
      };
    } else if (exception instanceof HttpException) {
      errorResponse = {
        name: exception.name,
        details: exception.getResponse(),
      };
    } else if (exception instanceof Error) {
      errorResponse = {
        name: exception.name,
        message: 'Internal server error on WebSocket',
        stack: exception.stack,
      };
    } else {
      errorResponse = {
        name: 'UnknownException',
        message: 'An unknown error occurred on the WebSocket.',
      };
    }
    client.emit('exception', {
      status: 'error',
      ...errorResponse,
    });
  }
}
