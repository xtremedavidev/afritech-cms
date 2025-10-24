'use client';

import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

const ORGANIZATION_UID_COOKIE = "organization_uid";

/**
 * Hook to get the organization UID from cookies
 * 
 * @returns The organization UID from the cookie, or null if not found
 */
export function useOrganizationCookie() {
  const [organizationUid, setOrganizationUid] = useState<string | null>(null);
  
  useEffect(() => {
    // We only access cookies on the client side
    const cookieValue = getCookie(ORGANIZATION_UID_COOKIE)?.toString() || null;
    setOrganizationUid(cookieValue);
  }, []);
  
  return organizationUid;
} 