'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
  createdAt: string
  posts: Array<{
    id: string
    title: string
    published: boolean
  }>
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({ email: '', name: '' })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.email) return

    try {
      setIsCreating(true)
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      setNewUser({ email: '', name: '' })
      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      await fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Erro:</strong> {error}
        <button
          onClick={() => {
            setError(null)
            fetchUsers()
          }}
          className="ml-4 underline"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciamento de Usuários</h1>

      {/* Form para criar novo usuário */}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Criar Novo Usuário</h2>
        <form onSubmit={createUser} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email *
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome
            </label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isCreating ? 'Criando...' : 'Criar Usuário'}
          </button>
        </form>
      </div>

      {/* Lista de usuários */}
      <div className="bg-white shadow-md rounded">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Lista de Usuários ({users.length})</h2>
        </div>
        {users.length === 0 ? (
          <div className="px-6 py-4 text-gray-500">
            Nenhum usuário encontrado.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div key={user.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{user.name || 'Sem nome'}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Posts: {user.posts.length}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 