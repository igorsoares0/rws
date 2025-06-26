# Integração Prisma + PostgreSQL

Este projeto demonstra a integração completa entre Next.js, Prisma e PostgreSQL.

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL instalado e rodando
- npm ou yarn

## 🚀 Configuração

### 1. Variáveis de Ambiente

Configure o arquivo `.env` com suas credenciais do PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/rws_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**Substitua:**
- `username`: seu usuário do PostgreSQL
- `password`: sua senha do PostgreSQL
- `rws_db`: nome do banco de dados (será criado automaticamente)

### 2. Instalação das Dependências

```bash
npm install
```

### 3. Configuração do Banco de Dados

```bash
# Gerar o cliente Prisma
npx prisma generate

# Criar e aplicar migrações
npx prisma migrate dev --name init

# (Opcional) Abrir o Prisma Studio para visualizar dados
npx prisma studio
```

### 4. Executar o Projeto

```bash
npm run dev
```

Acesse `http://localhost:3000` para ver a aplicação funcionando.

## 🗄️ Estrutura do Banco de Dados

### Modelos Definidos

#### User
- `id`: String (CUID)
- `email`: String (único)
- `name`: String (opcional)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `posts`: Relacionamento com Post[]

#### Post
- `id`: String (CUID)
- `title`: String
- `content`: String (opcional)
- `published`: Boolean (padrão: false)
- `authorId`: String (FK para User)
- `author`: Relacionamento com User
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### Category
- `id`: String (CUID)
- `name`: String (único)
- `description`: String (opcional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## 🛠️ Arquivos Principais

### `/prisma/schema.prisma`
Define o schema do banco de dados e configurações do Prisma.

### `/src/lib/prisma.ts`
Configuração do cliente Prisma com padrão singleton para evitar múltiplas conexões.

### `/src/lib/db.ts`
Serviços de banco de dados com operações CRUD para cada modelo.

### APIs REST

#### Usuários
- `GET /api/users` - Listar todos os usuários
- `POST /api/users` - Criar novo usuário
- `GET /api/users/[id]` - Buscar usuário por ID
- `PUT /api/users/[id]` - Atualizar usuário
- `DELETE /api/users/[id]` - Deletar usuário

#### Posts
- `GET /api/posts` - Listar todos os posts
- `POST /api/posts` - Criar novo post

## 🎯 Funcionalidades Implementadas

### ✅ Configuração Completa
- [x] Prisma configurado com PostgreSQL
- [x] Modelos de dados definidos
- [x] Cliente Prisma com singleton pattern
- [x] Serviços de banco de dados

### ✅ APIs REST
- [x] CRUD completo para usuários
- [x] CRUD básico para posts
- [x] Tratamento de erros
- [x] Validação de dados

### ✅ Interface de Usuário
- [x] Componente para listar usuários
- [x] Formulário para criar usuários
- [x] Funcionalidade de deletar usuários
- [x] Loading states e tratamento de erros
- [x] Design responsivo com Tailwind CSS

## 📝 Comandos Úteis do Prisma

```bash
# Gerar cliente após mudanças no schema
npx prisma generate

# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações em produção
npx prisma migrate deploy

# Resetar banco de dados (desenvolvimento)
npx prisma migrate reset

# Abrir Prisma Studio
npx prisma studio

# Fazer seed do banco de dados
npx prisma db seed

# Ver status das migrações
npx prisma migrate status
```

## 🔧 Exemplo de Uso dos Serviços

```typescript
import { userService, postService } from '@/lib/db'

// Criar usuário
const user = await userService.createUser({
  email: 'joao@example.com',
  name: 'João Silva'
})

// Buscar usuário com posts
const userWithPosts = await userService.getUserById(user.id)

// Criar post
const post = await postService.createPost({
  title: 'Meu primeiro post',
  content: 'Conteúdo do post...',
  authorId: user.id
})

// Listar posts publicados
const publishedPosts = await postService.getPublishedPosts()
```

## 🚨 Troubleshooting

### Erro de Conexão com PostgreSQL
1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão: `npx prisma db pull`

### Erro "Table doesn't exist"
Execute as migrações: `npx prisma migrate dev`

### Erro de Importação do Cliente Prisma
Execute: `npx prisma generate`

## 📚 Recursos Adicionais

- [Documentação do Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request 