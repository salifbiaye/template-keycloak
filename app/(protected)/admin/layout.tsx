import { ServerPermissionGuard } from '@/components/server-permission-guard'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ServerPermissionGuard requiredRole="ADMIN">
      {children}
    </ServerPermissionGuard>
  )
}

//  <ServerPermissionGuard requiredRoles={["ADMIN", "SUPER_ADMIN"]}>
//       {children}
//   </ServerPermissionGuard>