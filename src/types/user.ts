// Type definitions for user-related data

// User profile data returned from API
export interface UserProfile {
  discordid: string;
  discordtag: string;
  nameinlo?: string;
  clanid?: string;
  clanname?: string;
  clanflagcolor?: string;
  clansymbol?: string;
  isleader?: boolean;
  permissions?: UserPermissions;
}

// User permissions
export interface UserPermissions {
  canmanagemembers?: boolean;
  canmanageclan?: boolean;
  canmanagebot?: boolean;
  canmanagewalkers?: boolean;
  canmanagemaps?: boolean;
  canmanagediplomacy?: boolean;
}

// Discord connection response
export interface DiscordConnectionResponse {
  success: boolean;
  message: string;
  token?: string;
}

// Tech tree learned item
export interface LearnedTech {
  discordid: string;
  discordtag: string;
  tree: string;
  tech: string;
}
