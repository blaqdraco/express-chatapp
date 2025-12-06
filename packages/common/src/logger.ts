import pino from 'pino';

import  type { LoggerOptions } from 'pino';

type CreateLogger = LoggerOptions & {
    name?: string;
};

export const createLogger = (options?: CreateLogger): pino.Logger => {
    const { name, ...rest } = options;

    const transport = process.env.NODE_ENV === 'development'   
    ? { 
        target: 'pino-pretty', 
        options: { colorize: true, translateTime: "sys:standard" }
    } : undefined;

    return pino({
        name: name || 'app-logger',
        level: process.env.LOG_LEVEL || 'info',
        transport,
        ...rest,
    });
}