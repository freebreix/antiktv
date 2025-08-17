declare module '$env/dynamic/private' {
  export const env: Record<string, string | undefined>;
}

declare module '$env/static/private' {
  export const ANTIK_EMAIL: string | undefined;
  export const ANTIK_PASSWORD: string | undefined;
  export const ANTIK_DEVICE_ID: string | undefined;
  export const ANTIK_API_URL: string | undefined;
}
