import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanDatabase() {
  console.log('🧹 Limpando banco de dados...\n')

  try {
    console.log('📦 Deletando vendas...')
    await prisma.saleItem.deleteMany()
    await prisma.sale.deleteMany()
    console.log('✅ Vendas deletadas')

    console.log('\n📋 Deletando itens de pedido...')
    await prisma.orderItem.deleteMany()
    console.log('✅ Itens de pedido deletados')

    console.log('\n🛒 Deletando pedidos...')
    await prisma.order.deleteMany()
    console.log('✅ Pedidos deletados')

    console.log('\n👓 Deletando receitas...')
    await prisma.prescription.deleteMany()
    console.log('✅ Receitas deletadas')

    console.log('\n👥 Deletando clientes...')
    await prisma.customer.deleteMany()
    console.log('✅ Clientes deletados')

    console.log('\n📦 Deletando produtos...')
    await prisma.product.deleteMany()
    console.log('✅ Produtos deletados')

    console.log('\n✅ Banco de dados limpo com sucesso!')
  } catch (error) {
    console.error('\n❌ Erro ao limpar banco:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

cleanDatabase()
