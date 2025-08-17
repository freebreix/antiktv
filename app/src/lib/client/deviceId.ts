import { browser } from '$app/environment';

const DEVICE_ID_COOKIE_NAME = 'antiktv_device_id';
const DEVICE_ID_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Generate a unique device ID for this browser
 */
function generateDeviceId(): string {
  // Create a device ID based on browser characteristics and random elements
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const userAgent = browser ? navigator.userAgent : 'server';
  
  // Simple hash of user agent for consistency
  let hash = 0;
  for (let i = 0; i < userAgent.length; i++) {
    const char = userAgent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const deviceSuffix = `${Math.abs(hash).toString(36)}-${random}`.slice(0, 25);
  return `WebTV-browser-${deviceSuffix}`;
}

/**
 * Get the device ID from cookie, or generate and store a new one
 */
export function getOrCreateDeviceId(): string {
  if (!browser) {
    // On server side, return a temporary ID
    return 'WebTV-server-temp';
  }
  
  // Try to get existing device ID from cookie
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === DEVICE_ID_COOKIE_NAME && value) {
      console.log('📱 Using existing device ID from cookie:', value);
      return decodeURIComponent(value);
    }
  }
  
  // Generate new device ID
  const deviceId = generateDeviceId();
  console.log('📱 Generated new device ID:', deviceId);
  
  // Store in cookie with long expiration
  const cookieValue = `${DEVICE_ID_COOKIE_NAME}=${encodeURIComponent(deviceId)}; Max-Age=${DEVICE_ID_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
  document.cookie = cookieValue;
  
  return deviceId;
}

/**
 * Clear the device ID cookie (useful for testing or reset)
 */
export function clearDeviceId(): void {
  if (!browser) return;
  
  document.cookie = `${DEVICE_ID_COOKIE_NAME}=; Max-Age=0; Path=/`;
  console.log('📱 Device ID cookie cleared');
}

/**
 * Get the current device ID without generating a new one
 */
export function getCurrentDeviceId(): string | null {
  if (!browser) return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === DEVICE_ID_COOKIE_NAME && value) {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}
