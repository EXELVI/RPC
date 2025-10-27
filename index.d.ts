// Type definitions for discord-rpc (presence & activity structures)
// Definitions based on Discord Presence and Activity schema

/** A minimal User object as found in Presence events (can be partial) */
export interface PartialUser {
  id: string;
  username?: string;
  discriminator?: string;
  avatar?: string | null;
  bot?: boolean;
  [key: string]: any;
}

/** Client status object - platform-dependent status strings */
export interface ClientStatus {
  desktop?: 'online' | 'idle' | 'dnd' | 'offline' | string;
  mobile?: 'online' | 'idle' | 'dnd' | 'offline' | string;
  web?: 'online' | 'idle' | 'dnd' | 'offline' | string;
}

/** Activity timestamps */
export interface ActivityTimestamps {
  start?: number; // unix ms
  end?: number; // unix ms
}

/** Activity emoji used for custom statuses */
export interface ActivityEmoji {
  name: string;
  id?: string;
  animated?: boolean;
}

/** Activity party information */
export interface ActivityParty {
  id?: string;
  size?: [number, number];
}

/** Activity assets (images and hover text) */
export interface ActivityAssets {
  large_image?: string;
  large_text?: string;
  large_url?: string;
  small_image?: string;
  small_text?: string;
  small_url?: string;
  invite_cover_image?: string;
}

/** Activity secrets for Rich Presence */
export interface ActivitySecrets {
  join?: string;
  spectate?: string;
  match?: string;
}

/** Button object when sending activity (sending) */
export interface ActivityButton {
  label: string; // 1-32 chars
  url: string; // 1-512 chars
}

/** Activity (presence activity) */
export interface Activity {
  name: string;
  /** Use the ActivityType enum for known activity kinds */
  type?: ActivityType; // 0 Playing, 1 Streaming, 2 Listening, 3 Watching, 4 Custom, 5 Competing
  url?: string | null; // validated when type == 1
  /** unix ms when added to session */
  created_at?: number;
  timestamps?: ActivityTimestamps;
  application_id?: string;
  status_display_type?: number;
  details?: string;
  details_url?: string;
  state?: string;
  state_url?: string;
  emoji?: ActivityEmoji;
  party?: ActivityParty;
  assets?: ActivityAssets;
  secrets?: ActivitySecrets;
  instance?: boolean;
  flags?: ActivityFlags | number;
  // When received over gateway, buttons is string[] (labels). When sending, it's ActivityButton[]
  buttons?: ActivityButton[] | string[];
  [key: string]: any;
}

/** Presence Update event payload */
export interface PresenceUpdate {
  user?: PartialUser; // usually minimal; id is required when present
  guild_id?: string;
  status?: 'idle' | 'dnd' | 'online' | 'offline' | string;
  activities?: Activity[];
  client_status?: ClientStatus;
  [key: string]: any;
}

/** Top-level Presence object used by clients for setting own presence */
export interface Presence {
  status?: 'idle' | 'dnd' | 'online' | 'offline' | string;
  activities?: Activity[];
  since?: number | null;
  afk?: boolean;
  [key: string]: any;
}

/** Activity Types */
export enum ActivityType {
  Playing = 0,
  Streaming = 1,
  Listening = 2,
  Watching = 3,
  Custom = 4,
  Competing = 5,
}

/** Status Display Types */
export enum StatusDisplayType {
  Name = 0,
  State = 1,
  Details = 2,
}

/** Activity Flags */
export enum ActivityFlags {
  INSTANCE = 1 << 0,
  JOIN = 1 << 1,
  SPECTATE = 1 << 2,
  JOIN_REQUEST = 1 << 3,
  SYNC = 1 << 4,
  PLAY = 1 << 5,
  PARTY_PRIVACY_FRIENDS = 1 << 6,
  PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
  EMBEDDED = 1 << 8,
}

export namespace DiscordRPC {
  export type PartialUser = import('./index').PartialUser;
  export type ClientStatus = import('./index').ClientStatus;
  export type ActivityTimestamps = import('./index').ActivityTimestamps;
  export type ActivityEmoji = import('./index').ActivityEmoji;
  export type ActivityParty = import('./index').ActivityParty;
  export type ActivityAssets = import('./index').ActivityAssets;
  export type ActivitySecrets = import('./index').ActivitySecrets;
  export type ActivityButton = import('./index').ActivityButton;
  export type Activity = import('./index').Activity;
  export type PresenceUpdate = import('./index').PresenceUpdate;
  export type Presence = import('./index').Presence;
  export { ActivityType, StatusDisplayType, ActivityFlags };
}

export as namespace DiscordRPC;

/** Client options for RPC Client */
export interface ClientOptions {
  transport?: 'ipc' | 'websocket' | string;
  // Allow other options
  [key: string]: any;
}

/** RPC Client class exported as `Client` */
export class Client extends NodeJS.EventEmitter {
  constructor(options?: ClientOptions);
  options: ClientOptions;
  accessToken: string | null;
  clientId: string | null;
  application: any | null;
  user: any | null;

  connect(clientId?: string): Promise<Client>;
  login(options?: { clientId?: string; clientSecret?: string; accessToken?: string; rpcToken?: string | boolean; tokenEndpoint?: string; scopes?: string[]; redirectUri?: string; prompt?: string; }): Promise<Client>;
  authenticate(accessToken: string): Promise<Client>;
  request(cmd: string, args?: any, evt?: string): Promise<any>;
  getGuild(id: string, timeout?: number): Promise<any>;
  getGuilds(timeout?: number): Promise<any>;
  getChannel(id: string, timeout?: number): Promise<any>;
  getChannels(id?: string, timeout?: number): Promise<any[]>;
  setCertifiedDevices(devices: Array<any>): Promise<any>;
  setUserVoiceSettings(id: string, settings: any): Promise<any>;
  selectVoiceChannel(id: string, options?: { timeout?: number; force?: boolean; }): Promise<any>;
  selectTextChannel(id: string, options?: { timeout?: number; }): Promise<any>;
  getVoiceSettings(): Promise<any>;
  setVoiceSettings(args: any): Promise<any>;
  captureShortcut(callback: (key: any, stop: () => Promise<any> | any) => void): Promise<() => Promise<any>>;
  /**
   * Set activity/presence. Accepts either an Activity object, a partial Activity,
   * or an object with an `activity` field (to match existing API flexibility).
   */
  setActivity(args?: Activity | Partial<Activity> | { activity?: Activity | Partial<Activity> }, pid?: number): Promise<any>;
  clearActivity(pid?: number): Promise<any>;
  sendJoinInvite(user: any): Promise<any>;
  sendJoinRequest(user: any): Promise<any>;
  closeJoinRequest(user: any): Promise<any>;
  createLobby(type: number, capacity: number, metadata: any): Promise<any>;
  updateLobby(lobby: any, options?: { type?: number; owner?: any; capacity?: number; metadata?: any; }): Promise<any>;
  deleteLobby(lobby: any): Promise<any>;
  connectToLobby(id: string, secret: string): Promise<any>;
  sendToLobby(lobby: any, data: any): Promise<any>;
  disconnectFromLobby(lobby: any): Promise<any>;
  updateLobbyMember(lobby: any, user: any, metadata: any): Promise<any>;
  getRelationships(): Promise<any[]>;
  subscribe(event: string, args?: any): Promise<{ unsubscribe: () => Promise<any> }>;
  destroy(): Promise<void>;
}

/** Register helper exported at top-level (module.register) */
export function register(id: string): string;

// Also export types in the DiscordRPC namespace
export namespace DiscordRPC {
  export type Client = import('./index').Client;
}
