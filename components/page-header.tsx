"use client"

import { RiPlayLine } from "@remixicon/react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NAV_CONFIG, ICON_MAP } from "@/nav-config"
import ThemeToggle from "@/components/theme-toggle"
import UserDropdown from "@/components/user-dropdown"

interface BreadcrumbItem {
  title: string
  href?: string
}

interface PageHeaderProps {
  /** Titre de la page actuelle */
  title: string
  /** Code du module pour trouver l'icône dans nav-config */
  moduleCode?: string
  /** Breadcrumbs personnalisés (optionnel) */
  breadcrumbs?: BreadcrumbItem[]
  /** Masquer les actions de droite (ThemeToggle, SimpleLogoutButton) */
  hideActions?: boolean
}

export function PageHeader({
  title,
  moduleCode,
  breadcrumbs,
  hideActions = false
}: PageHeaderProps) {
  // Trouver l'icône du module dans nav-config
  const findModuleIcon = (code?: string) => {
    if (!code) return "RiPlayLine"

    for (const group of NAV_CONFIG.navMain) {
      const item = group.items.find(item => item.moduleCode === code)
      if (item?.icon) return item.icon
    }
    return "RiPlayLine"
  }

  const iconName = findModuleIcon(moduleCode)
  const IconComponent = ICON_MAP[iconName] || RiPlayLine

  // Breadcrumbs par défaut si non fournis
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/" },
    { title }
  ]

  const finalBreadcrumbs = breadcrumbs || defaultBreadcrumbs

  return (
    <div className="px-4 md:px-6 lg:px-8 bg-background w-full">
      <div className="flex h-16  items-center gap-2 border-b">
        <div className="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger className="-ms-4 hidden md:flex" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4 hidden md:block"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {finalBreadcrumbs.map((item, index) => (
                <div key={`${item.title}-${index}`} className="flex items-center">
                  {index === 0 && (
                    <>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href={item.href || "#"} className="flex items-center gap-2">
                          <IconComponent size={18} aria-hidden="true" />
                          <span className="sr-only">{item.title}</span>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {finalBreadcrumbs.length > 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </>
                  )}
                  {index > 0 && (
                    <>
                      <BreadcrumbItem>
                        {item.href && index < finalBreadcrumbs.length - 1 ? (
                          <BreadcrumbLink href={item.href}>
                            {item.title}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{item.title}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < finalBreadcrumbs.length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </>
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {!hideActions && (
          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <UserDropdown />
          </div>
        )}
      </div>
    </div>
  )
}