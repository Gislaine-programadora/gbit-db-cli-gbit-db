export type TableTemplate = {
  id: string;
  name: string;
  description: string;
  code: string;
  hint?: string;
};


export const tableTemplates: TableTemplate[] = [
  {
    id: "login",
    name: "Login / Autenticação",
    description: "Usuário com email, senha e papel (admin/cliente).",
    code: `enum Role {
  ADMIN
  CLIENT
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CLIENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
  },
  {
    id: "crypto",
    name: "Cripto / Carteira",
    description: "Carteira e histórico de transações vinculados a um usuário.",
    code: `model Wallet {
  id           String        @id @default(uuid())
  address      String        @unique
  network      String        @default("ethereum")
  balance      Decimal       @default(0)
  user         User          @relation(fields: [userId], references: [id])
  userId       String
  transactions Transaction[]
  createdAt    DateTime      @default(now())
}

model Transaction {
  id        String   @id @default(uuid())
  hash      String   @unique
  amount    Decimal
  from      String
  to        String
  status    String   @default("pending")
  wallet    Wallet   @relation(fields: [walletId], references: [id])
  walletId  String
  createdAt DateTime @default(now())
}`,
    hint: 'Dentro do model "User", adicione: wallets Wallet[]',
  },
  {
    id: "ecommerce",
    name: "Ecommerce (produtos e pedidos)",
    description: "Produtos, pedidos e itens de pedido, com relação entre eles.",
    code: `model Product {
  id          String      @id @default(uuid())
  name        String
  description String?
  price       Float
  stock       Int         @default(0)
  imageUrl    String?
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
}

model Order {
  id        String      @id @default(uuid())
  status    String      @default("pending")
  total     Float
  user      User        @relation(fields: [userId], references: [id])
  userId    String
  items     OrderItem[]
  createdAt DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(uuid())
  quantity  Int
  price     Float
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
}`,
    hint: 'Dentro do model "User", adicione: orders Order[]',
  },
  {
    id: "notifications",
    name: "Notificações",
    description: "Notificações de usuário, com status lido/não lido.",
    code: `model Notification {
  id        String   @id @default(uuid())
  title     String
  message   String
  read      Boolean  @default(false)
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
}`,
    hint: 'Dentro do model "User", adicione: notifications Notification[]',
  },
  {
    id: "blog",
    name: "Blog / Posts",
    description: "Posts com autor, slug único e status de publicação.",
    code: `model Post {
  id        String   @id @default(uuid())
  title     String
  slug      String   @unique
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
    hint: 'Dentro do model "User", adicione: posts Post[]',
  },
];