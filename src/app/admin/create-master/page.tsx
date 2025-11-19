'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function CreateMasterPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('genilson.b.amaral@gmail.com')
  const [password, setPassword] = useState('123456')
  const [fullName, setFullName] = useState('Genilson Amaral (Master)')
  const { toast } = useToast()

  const createMasterAccount = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-test-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          userData: {
            full_name: fullName,
            is_master: true
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: '✅ Conta mestre criada com sucesso!',
          description: `Email: ${email} | Senha: ${password}`,
          duration: 10000,
        })
      } else {
        toast({
          title: '❌ Erro ao criar conta',
          description: data.error || 'Erro desconhecido',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: '❌ Erro',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🔑 Criar Conta Mestre</CardTitle>
          <CardDescription>
            Crie ou restaure a conta mestre de teste
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="senha"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nome completo"
            />
          </div>

          <Button
            onClick={createMasterAccount}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Criando...' : '✨ Criar Conta Mestre'}
          </Button>

          <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
            <p className="font-semibold mb-2">📋 Credenciais padrão:</p>
            <p>Email: {email}</p>
            <p>Senha: {password}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
