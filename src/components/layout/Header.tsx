import { ShoppingBag, User, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface HeaderProps {
  user: any
  onSignOut: () => void
}

export function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">OllaCart</h1>
        </div>
        <span className="text-sm text-gray-500">AI-Powered Social Shopping</span>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700">
            {user?.displayName || user?.email}
          </span>
          <Button variant="ghost" size="sm" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}