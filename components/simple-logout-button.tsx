'use client';

import { Button } from '@/components/ui/button';
import { RiLogoutBoxLine } from '@remixicon/react';
import { logout } from '@/lib/auth-simple';

export default function SimpleLogoutButton() {

  return (
    <Button
      onClick={logout}
      variant="outline"
      size="sm"
      className="w-full justify-start"
    >
      <RiLogoutBoxLine className="w-4 h-4 mr-2" />
      Se déconnecter
    </Button>
  );
}