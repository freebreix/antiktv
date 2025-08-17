export type Channel = {
  id: string;
  name: string;
  logo?: string;
  url: string;
  number?: number;
  group?: string;
};

export type Program = {
  id: string;
  channelId: string;
  title: string;
  start: number; // epoch ms
  end: number;   // epoch ms
  description?: string;
};

export type AntikCredentials = {
  email: string;
  password: string;
  deviceId?: string;
};
