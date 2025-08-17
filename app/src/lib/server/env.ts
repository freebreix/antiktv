import { env } from '$env/dynamic/private';

export type AntikEnv = {
  email?: string;
  password?: string;
  deviceId?: string;
  apiUrl?: string;
  region?: 'SK' | 'CZ';
};

export function getAntikEnv(): AntikEnv {
  return {
  email: env.ANTIK_EMAIL || undefined,
  password: env.ANTIK_PASSWORD || undefined,
  deviceId: env.ANTIK_DEVICE_ID || undefined,
  apiUrl: env.ANTIK_API_URL || undefined,
  region: (env.ANTIK_REGION as any) || undefined
  };
}

export function isAntikConfigured(env = getAntikEnv()): env is Required<Pick<AntikEnv, 'email' | 'password'>> & AntikEnv {
  return Boolean(env.email && env.password);
}
