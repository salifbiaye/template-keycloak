"use client"
import * as React from "react";
import { usePathname } from "next/navigation";
import { NAV_CONFIG, ICON_MAP } from "@/nav-config";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { RiShieldLine, RiArrowRightSLine, RiMenuLine } from "@remixicon/react";
import ThemeToggle from "@/components/theme-toggle";
import SimpleLogoutButton from "@/components/simple-logout-button";
import Link from "next/link";

export function ProSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (itemUrl: string) => {
    if (itemUrl === "/" && pathname === "/") return true;
    if (itemUrl === "/dashboard" && pathname === "/dashboard") return true;
    if (itemUrl !== "/" && itemUrl !== "/dashboard") {
      return pathname.startsWith(itemUrl);
    }
    return false;
  };

  // Calculer le nombre total d'actions
  const totalActions = NAV_CONFIG.navMain.reduce((acc, group) =>
    acc + group.items.reduce((itemAcc, item) => itemAcc + (item.actions?.length || 0), 0), 0
  );

  // Composant pour les actions avec description adaptée mobile/desktop
  const ActionItem = ({ action, isMobileView = false }: { action: any, isMobileView?: boolean }) => (
    <div
      className="flex items-center gap-2.5 p-2 rounded-md bg-muted hover:bg-muted/80 transition-colors group/action border border-border/50 cursor-help relative"
    >
      <div className="h-2 w-2 rounded-full bg-primary group-hover/action:scale-110 transition-transform"></div>
      <span className="text-xs font-medium text-muted-foreground group-hover/action:text-primary transition-colors">
        {action.title}
      </span>
      {!isMobileView && (
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/action:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-card rounded-lg shadow-lg p-3 min-w-[180px] max-w-[250px] border border-border/40 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
              <span className="font-medium text-xs text-card-foreground">Description</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {action.description}
            </p>
          </div>
        </div>
      )}
      {isMobileView && (
        <div className="ml-auto">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-muted/50">
            Info
          </Badge>
        </div>
      )}
    </div>
  );

  // Contenu de navigation réutilisable
  const NavigationContent = ({ isMobileView = false }: { isMobileView?: boolean }) => (
    <>
      {NAV_CONFIG.navMain.map((group) => (
        <div key={group.title} className={isMobileView ? "px-6 py-4" : ""}>
          <div className={`text-xs font-medium text-muted-foreground/70 uppercase tracking-wide mb-3 ${isMobileView ? "" : "px-4 py-2"}`}>
            {group.title}
          </div>
          <div className="space-y-2">
            {group.items.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || ICON_MAP["RiApps2Line"];
              return (
                <div key={item.title}>
                  {item.actions && item.actions.length > 0 && !isMobileView ? (
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <div className="mx-2 rounded-md relative">
                          <a href={item.url} className={`flex items-start gap-3 group/item rounded-md transition-all duration-200 hover:bg-accent relative ${isActive(item.url) ? 'bg-accent text-accent-foreground px-5 py-2.5 ml-2' : 'px-2 py-2'}`}>
                            {isActive(item.url) && (
                              <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></div>
                            )}
                            <IconComponent
                              className="h-4 w-4 text-muted-foreground"
                              size={16}
                            />
                            <div className="flex flex-col min-w-0 flex-1 space-y-1">
                              <span className="text-sm font-medium truncate">
                                {item.title}
                              </span>
                              {item.description && (
                                <span className="text-xs text-muted-foreground/70 truncate leading-tight">
                                  {item.description}
                                </span>
                              )}
                              <div className="flex items-center gap-1.5 group-hover/item:scale-105 transition-transform duration-200">
                                <RiShieldLine className="h-3 w-3 text-primary/60 group-hover/item:text-primary transition-colors" />
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 h-4 bg-primary/5 text-primary/70 border-primary/20 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors"
                                >
                                  {item.actions.length} permission{item.actions.length > 1 ? 's' : ''}
                                </Badge>
                                <RiArrowRightSLine className="h-3 w-3 text-muted-foreground/60 group-hover/item:text-primary/80 group-hover/item:translate-x-0.5 transition-all duration-200" />
                              </div>
                            </div>
                          </a>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="p-0 border-0 bg-transparent shadow-none"
                        sideOffset={12}
                      >
                        <div className="bg-card rounded-lg shadow-lg p-4 min-w-[220px] max-w-[300px] animate-in fade-in-0 zoom-in-95 duration-200">
                          <div className="flex items-center gap-2 mb-3 pb-2">
                            <RiShieldLine className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm text-card-foreground">Permissions autorisées</span>
                          </div>
                          <div className="space-y-2">
                            {item.actions.map((action, idx) => (
                              <ActionItem key={idx} action={action} isMobileView={false} />
                            ))}
                          </div>
                          <div className="mt-3 pt-2 border-t border-border">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <span>Module:</span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/30">
                                  {item.moduleCode}
                                </Badge>
                              </span>
                              <span>{item.actions.length} action{item.actions.length > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className={isMobileView ? "" : "mx-2 rounded-md"}>
                      <a href={item.url} className={`flex items-start gap-3 rounded-md transition-all duration-200 hover:bg-accent relative ${isActive(item.url) ? 'bg-accent text-accent-foreground px-5 py-2.5 ml-2' : 'px-2 py-2'} ${isMobileView ? 'py-3' : ''}`} onClick={isMobileView ? () => setIsMobileMenuOpen(false) : undefined}>
                        {isActive(item.url) && !isMobileView && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></div>
                        )}
                        <IconComponent
                          className="h-4 w-4 text-muted-foreground"
                          size={16}
                        />
                        <div className="flex flex-col min-w-0 flex-1 space-y-1">
                          <span className="text-sm font-medium truncate">
                            {item.title}
                          </span>
                          {item.description && (
                            <span className="text-xs text-muted-foreground/70 truncate leading-tight">
                              {item.description}
                            </span>
                          )}
                          {isMobileView && item.actions && item.actions.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-1.5">
                                <RiShieldLine className="h-3 w-3 text-primary/60" />
                                <span className="text-[10px] text-muted-foreground">
                                  {item.actions.length} permission{item.actions.length > 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="space-y-1 pl-4">
                                {item.actions.map((action, idx) => (
                                  <div key={idx} className="text-[10px] text-muted-foreground/60">
                                    • {action.title}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Bouton menu mobile flottant */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        >
          <RiMenuLine className="h-6 w-6" />
        </button>

        {/* Bottom Sheet */}
        <BottomSheet
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <NavigationContent isMobileView={true} />

          {/* Footer mobile */}
          <div className="px-6 py-4 border-t border-border/20 bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">Thème</span>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <span>En ligne</span>
              </div>
              <span>{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
            </div>
          </div>
        </BottomSheet>
      </>
    );
  }

  return (
    <TooltipProvider>
      <Sidebar className="border-r border-border/40" {...props}>
      <SidebarHeader className="border-b border-border/40">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">
              {NAV_CONFIG.functionCode.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{NAV_CONFIG.functionCode}</span>
            <span className="text-xs text-muted-foreground">
              {NAV_CONFIG.navMain.reduce((acc, group) => acc + group.items.length, 0)} modules • {totalActions} actions
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {NAV_CONFIG.navMain.map((group, groupIndex) => (
          <SidebarGroup key={group.title} className={`${groupIndex > 0 ? 'mt-6' : ''}`}>
            <SidebarGroupLabel className="px-2 py-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wide border-b border-border/30 mb-3">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {group.items.map((item) => {
                  const IconComponent = ICON_MAP[item.icon] || ICON_MAP["RiApps2Line"];
                  return (
                    <SidebarMenuItem key={item.title}>
                      {item.actions && item.actions.length > 0 ? (
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.url)}
                            className="mx-1 rounded-lg  relative"
                          >
                            <Link href={item.url} className={`flex items-center text-center gap-3 group/item transition-all duration-200 ${isActive(item.url) ? 'px-6 py-2.5 ml-2' : 'px-3 py-3'}`}>
                              {isActive(item.url) && (
                                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></div>
                              )}
                              <IconComponent
                                  className="h-4 w-4 text-muted-foreground data-[active=true]:text-primary"
                                  size={16}
                              />
                              <div className="flex flex-col min-w-0 flex-1 space-y-1">

                                {/*{item.description && (*/}
                                {/*    <span className="text-xs text-muted-foreground/70 truncate leading-relaxed">*/}
                                {/*    {item.description}*/}
                                {/*  </span>*/}
                                {/*)}*/}

                                {item.actions && item.actions.length > 0 && (
                                    <div className="flex ">
                                      <span className="text-sm font-medium truncate leading-relaxed">
                                  {item.title}</span>
                                      <RiArrowRightSLine
                                          className="h-6 w-6 text-muted-foreground/60 group-hover/item:text-primary/80 group-hover/item:translate-x-0.5 transition-all duration-200" />
                                    </div>
                                )}
                              </div>
                            </Link>

                          </SidebarMenuButton>
                        </TooltipTrigger>
                          <TooltipContent
                            side="right"
                            className="p-0 border-0 bg-transparent shadow-none"
                            sideOffset={12}
                          >
                            <div className="bg-card rounded-lg shadow-lg p-4 min-w-[220px] max-w-[300px] animate-in fade-in-0 zoom-in-95 duration-200">
                              <div className="flex items-center gap-2 mb-3 pb-2">
                                <RiShieldLine className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-sm text-card-foreground">Permissions autorisées</span>
                              </div>
                              <div className="space-y-2">
                                {item.actions.map((action, idx) => (
                                  <ActionItem key={idx} action={action} isMobileView={false} />
                                ))}
                              </div>
                              <div className="mt-3 pt-2 border-t border-border">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <span>Module:</span>
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/30">
                                      {item.moduleCode}
                                    </Badge>
                                  </span>
                                  <span>{item.actions.length} action{item.actions.length > 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          className="mx-1 rounded-lg mb-2 relative"
                        >
                          <Link href={item.url} className={`flex items-start gap-3 transition-all duration-200 ${isActive(item.url) ? 'px-6 py-2.5 ml-2' : 'px-3 py-3'}`}>
                            {isActive(item.url) && (
                              <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"></div>
                            )}
                            <IconComponent
                              className="h-4 w-4 text-muted-foreground data-[active=true]:text-primary"
                              size={16}
                            />
                            <div className="flex flex-col min-w-0 flex-1 space-y-1">
                              <span className="text-sm font-medium truncate leading-relaxed">
                                {item.title}
                              </span>
                              {item.description && (
                                <span className="text-xs text-muted-foreground/70 truncate leading-relaxed">
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40">
        <div className="px-4 py-3 space-y-3">
          {/* Logout Button */}
          <SimpleLogoutButton />

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Thème</span>
            <ThemeToggle />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
              <span>En ligne</span>
            </div>
            <span>{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}