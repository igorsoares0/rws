import UserList from '@/components/UserList'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            RWS - Sistema Completo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Sistema integrado com Prisma, PostgreSQL e funcionalidades avançadas
          </p>
          
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <Link 
              href="/reviews"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900">Sistema de Avaliações</h3>
                  <p className="text-gray-600">Colete reviews com 5 estrelas, fotos e vídeos</p>
                </div>
              </div>
            </Link>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900">Gerenciamento de Usuários</h3>
                  <p className="text-gray-600">CRUD completo de usuários e posts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <UserList />
      </div>
    </div>
  )
}
