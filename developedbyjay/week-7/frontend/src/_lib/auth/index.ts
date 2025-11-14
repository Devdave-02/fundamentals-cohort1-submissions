import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { apiClient } from "../server/client";

export interface UserProfile {
  _id: string;
}

interface ProfileCache {
  [token: string]: {
    profile: UserProfile;
    timestamp: number;
  };
}

const profileCache: ProfileCache = {};
const CACHE_DURATION = 5 * 60 * 1000;

setInterval(() => {
  clearExpiredCache();
}, CACHE_DURATION);

function clearExpiredCache(): void {
  const now = Date.now();
  Object.keys(profileCache).forEach((token) => {
    if (now - profileCache[token].timestamp > CACHE_DURATION) {
      delete profileCache[token];
    }
  });
}

function clearCacheForToken(token: string): void {
  delete profileCache[token];
}

export const getUserIdFromHeaders = async (): Promise<string> => {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    redirect("/login");
  }

  return userId;
};

export const getAccessTokenFromHeaders = async (): Promise<string> => {
  const headersList = await headers();
  const accessToken = headersList.get("x-access-token");

  if (!accessToken) {
    redirect("/login");
  }

  return accessToken;
};

export async function getCurrentProfile(token: string): Promise<UserProfile> {
  try {
    clearExpiredCache();

    const cached = profileCache[token];
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Return cache merchant profile`);
      return cached.profile;
    }

    const profile = await apiClient.get<{
      user: UserProfile;
    }>("/user/current-user", token);

    if (profile.user._id) {
      profileCache[token] = {
        profile: profile.user,
        timestamp: Date.now(),
      };
    }
    return profile.user;

  } catch (error) {
    clearCacheForToken(token)
    console.error('Error fetching profile',error)
    throw error
  }
}
