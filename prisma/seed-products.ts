import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adicionando produtos de exemplo...\n')

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Armação Oakley Holbrook',
        category: 'Armações',
        price: 749.90,
        costPrice: 375.00,
        stock: 8,
      }
    }),
    prisma.product.create({
      data: {
        name: 'Armação Ray-Ban Round',
        category: 'Armações',
        price: 599.90,
        costPrice: 300.00,
        stock: 12,
      }
    }),
    prisma.product.create({
      data: {
        name: 'Armação Vogue Feminina',
        category: 'Armações',
        price: 459.90,
        costPrice: 230.00,
        stock: 15,
      }
    }),
    prisma.product.create({
      data: {
        name: 'Lente Varilux Comfort Max',
        category: 'Lentes Oftálmicas',
        price: 1290.00,
        costPrice: 645.00,
        stock: 25,
        labCode: 'VAR-001',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Lente Zeiss SmartLife',
        category: 'Lentes Oftálmicas',
        price: 1890.00,
        costPrice: 945.00,
        stock: 18,
        labCode: 'ZSL-001',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Lente Transitions Gen 8',
        category: 'Lentes Oftálmicas',
        price: 450.00,
        costPrice: 225.00,
        stock: 35,
        labCode: 'TR8-001',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Lente de Contato Acuvue',
        category: 'Lentes de Contato',
        price: 189.90,
        costPrice: 95.00,
        stock: 60,
      }
    }),
    prisma.product.create({
      data: {
        name: 'Lente de Contato Biofinity',
        category: 'Lentes de Contato',
        price: 159.90,
        costPrice: 80.00,
        stock: 45,
      }
    }),
  ])

  console.log(`✅ ${products.length} produtos adicionados`)
  console.log('\n📦 Categorias:')
  console.log('  • Armações: 3 produtos')
  console.log('  • Lentes Oftálmicas: 3 produtos')
  console.log('  • Lentes de Contato: 2 produtos')
}

main()
  .catch((e) => {
    console.error('\n❌ Erro:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
