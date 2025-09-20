'use client';

import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RiUserLine, RiSettingsLine, RiLogoutBoxLine, RiShieldLine, RiVipCrownLine } from '@remixicon/react';
import { getUserInfo, getDisplayName, getInitials, getUserRoles, hasRole, UserInfo } from '@/lib/jwt-utils';
import { logout } from '@/lib/auth-simple';

export default function UserDropdown() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  if (!userInfo) {
    return null; // Ne pas afficher si pas d'utilisateur connecté
  }

  const displayName = getDisplayName(userInfo);
  const initials = getInitials(userInfo);
  const userRoles = getUserRoles(userInfo);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <AvatarImage src="" alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                {userInfo.email && (
                  <p className="text-xs leading-none text-muted-foreground">
                    {userInfo.email}
                  </p>
                )}
              </div>
            </div>
            {userInfo.preferred_username && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <RiUserLine className="w-3 h-3" />
                <span>@{userInfo.preferred_username}</span>
              </div>
            )}
            {userRoles.length > 0 && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <RiVipCrownLine className="w-3 h-3" />
                <span className="flex flex-wrap gap-1">
                  {userRoles.slice(0, 3).map((role, index) => (
                    <span
                      key={role}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {role}
                    </span>
                  ))}
                  {userRoles.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{userRoles.length - 3}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <RiUserLine className="w-4 h-4 mr-2" />
          <span>Profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <RiSettingsLine className="w-4 h-4 mr-2" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <RiShieldLine className="w-4 h-4 mr-2" />
          <span>Sécurité</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={logout}
        >
          <RiLogoutBoxLine className="w-4 h-4 mr-2" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}