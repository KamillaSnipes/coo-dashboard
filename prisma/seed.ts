import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'kamilla@megamind.ru' }
  })

  if (existingUser) {
    console.log('User already exists:', existingUser.email)
    return
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('HeadcornCOO2026!', 12)
  
  const user = await prisma.user.create({
    data: {
      email: 'kamilla@megamind.ru',
      name: 'Камилла Каюмова',
      password: hashedPassword,
      role: 'admin',
      totpEnabled: false,
    }
  })

  console.log('Created user:', user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

