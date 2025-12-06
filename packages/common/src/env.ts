import { z, ZodObject, ZodRawShape } from 'zod';

interface ENVOptions {
  source?: NodeJS.ProcessEnv;
  serviceName?: string;
}

type SchemaOutput<T extends ZodRawShape> = z.infer<ZodObject<T>>;

export const createEnv = <T extends ZodRawShape>(
  schema: ZodObject<T>,
  options?: ENVOptions
): SchemaOutput<T> => {
  const { source = process.env, serviceName = "service" } = options ?? {};

  const parsed = schema.safeParse(source);

  if (!parsed.success) {
    const formattedErrors = parsed.error.errors
      .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
      .join('\n');
    throw new Error(
      `[${serviceName}] Invalid environment variables:\n${formattedErrors}`
    );
  }

  return parsed.data;
};