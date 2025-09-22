'use client'

import type React from "react"
import { useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ProSidebar } from "@/components/pro-sidebar"
import { startTokenRefreshTimer, getUserInfo, isTokenExpired, refreshAccessToken } from "@/lib/jwt-utils"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Démarrer le timer de refresh automatique
    startTokenRefreshTimer();

    // Vérifier immédiatement si un refresh est nécessaire
    const checkAndRefreshToken = async () => {
      const userInfo = getUserInfo();
      if (userInfo && isTokenExpired(userInfo)) {
        console.log('🔄 Token expired on page load, refreshing...');
        await refreshAccessToken();
      }
    };

    checkAndRefreshToken();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <ProSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}