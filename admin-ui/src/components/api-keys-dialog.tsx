import { useMemo, useState } from 'react'
import { Check, Copy, Eye, EyeOff, KeyRound } from 'lucide-react'
import { storage } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ApiKeysDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function maskKey(key: string | null): string {
  if (!key) return '未配置'
  if (key.length <= 12) return `${key.slice(0, 4)}****`
  return `${key.slice(0, 12)}...${key.slice(-6)}`
}

export function ApiKeysDialog({ open, onOpenChange }: ApiKeysDialogProps) {
  const [showKeys, setShowKeys] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const keys = useMemo(
    () => ({
      service: storage.getServiceApiKey(),
      admin: storage.getAdminApiKey(),
    }),
    [open]
  )

  const copyKey = async (name: string, key: string | null) => {
    if (!key) {
      return
    }

    await navigator.clipboard.writeText(key)
    setCopiedKey(name)
    window.setTimeout(() => setCopiedKey(null), 1500)
  }

  const rows = [
    {
      name: 'service',
      label: '服务 API Key',
      description: '调用 /v1 或 /cc/v1 接口时使用',
      value: keys.service,
    },
    {
      name: 'admin',
      label: 'Admin API Key',
      description: '管理面板接口认证使用',
      value: keys.admin,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            配置 API Key
          </DialogTitle>
          <DialogDescription>
            显示 config.json 中写入并保存到浏览器的 API Key。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowKeys(prev => !prev)}
            >
              {showKeys ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showKeys ? '隐藏完整 Key' : '显示完整 Key'}
            </Button>
          </div>

          {rows.map(row => (
            <div key={row.name} className="space-y-2">
              <div>
                <div className="text-sm font-medium">{row.label}</div>
                <div className="text-xs text-muted-foreground">{row.description}</div>
              </div>
              <div className="flex gap-2">
                <Input
                  readOnly
                  type={showKeys ? 'text' : 'password'}
                  value={showKeys ? row.value || '' : maskKey(row.value)}
                  className="font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyKey(row.name, row.value)}
                  disabled={!row.value}
                  title={`复制${row.label}`}
                >
                  {copiedKey === row.name ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
