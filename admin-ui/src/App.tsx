import { useEffect, useState } from 'react'
import { getBootstrapKeys } from '@/api/credentials'
import { storage } from '@/lib/storage'
import { LoginPage } from '@/components/login-page'
import { Dashboard } from '@/components/dashboard'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (storage.getAdminApiKey()) {
        setIsLoggedIn(true)
        setIsBootstrapping(false)
        return
      }

      try {
        const keys = await getBootstrapKeys()
        if (cancelled) {
          return
        }

        if (keys.apiKey) {
          storage.setServiceApiKey(keys.apiKey)
        }
        if (keys.adminApiKey) {
          storage.setAdminApiKey(keys.adminApiKey)
          setIsLoggedIn(true)
        }
      } catch {
        if (!cancelled) {
          setIsLoggedIn(false)
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false)
        }
      }
    }

    bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-sm text-muted-foreground">
        正在加载管理配置...
      </div>
    )
  }

  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
      <Toaster position="top-right" />
    </>
  )
}

export default App
