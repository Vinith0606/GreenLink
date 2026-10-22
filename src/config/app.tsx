import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AppContext'
import type { UserRole } from '@/types'
import Landing from '@/pages/Landing'

export const roleHome: Record<UserRole, string> = {
  farmer: '/farmer/dashboard',
  consumer: '/consumer/home',
  delivery: '/delivery/dashboard',
  admin: '/admin/dashboard',
}

const configuredRole = import.meta.env.VITE_APP_ROLE

export function getConfiguredRole(): UserRole | null {
  return ['farmer', 'consumer', 'delivery', 'admin'].includes(configuredRole || '')
    ? configuredRole as UserRole
    : null
}

export function RoleEntry() {
  const appRole = getConfiguredRole()
  const { role, isAuthenticated } = useAuth()

  if (!appRole) return <Landing />
  if (isAuthenticated && role === appRole) return <Navigate to={roleHome[appRole]} replace />
  return <Navigate to={`/login/${appRole}`} replace />
}
