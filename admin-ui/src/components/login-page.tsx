import { useEffect, useState } from 'react'
import { KeyRound, Server } from 'lucide-react'
import { storage } from '@/lib/storage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface LoginPageProps {
  onLogin: (apiKey: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [serviceApiKey, setServiceApiKey] = useState('')
  const [adminApiKey, setAdminApiKey] = useState('')

  useEffect(() => {
    // 首次启动后，用户可以把控制台或 config.json 中生成的密钥保存到浏览器。
    setServiceApiKey(storage.getServiceApiKey() || '')
    setAdminApiKey(storage.getAdminApiKey() || '')
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedServiceKey = serviceApiKey.trim()
    const normalizedAdminKey = adminApiKey.trim()

    if (normalizedServiceKey) {
      storage.setServiceApiKey(normalizedServiceKey)
    }
    if (normalizedAdminKey) {
      storage.setAdminApiKey(normalizedAdminKey)
      onLogin(normalizedAdminKey)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Kiro Admin</CardTitle>
          <CardDescription>
            启动后自动生成密钥，填入后即可进入管理面板
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4" />
                服务 API Key
              </label>
              <Input
                type="password"
                placeholder="sk-kiro-rs-..."
                value={serviceApiKey}
                onChange={(e) => setServiceApiKey(e.target.value)}
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                客户端调用 /v1 或 /cc/v1 接口时使用，可在 config.json 的 apiKey 中查看。
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                Admin API Key
              </label>
              <Input
                type="password"
                placeholder="sk-kiro-admin-..."
                value={adminApiKey}
                onChange={(e) => setAdminApiKey(e.target.value)}
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                管理面板认证使用，可在 config.json 的 adminApiKey 中查看。
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={!adminApiKey.trim()}>
              保存并进入
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
