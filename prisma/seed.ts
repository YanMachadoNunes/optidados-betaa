import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n')

  // ========== USUÁRIO ==========
  console.log('👤 Criando usuário...')
  const user = await prisma.user.upsert({
    where: { email: 'admin@optigestao.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@optigestao.com',
      password: 'admin123',
      plan: 'PREMIUM',
    }
  })
  console.log(`✅ Usuário criado: ${user.email}`)

  // ========== CLIENTES ==========
  console.log('👥 Criando clientes...')
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Maria Silva Santos',
        email: 'maria.silva@email.com',
        phone: '(11) 98765-4321',
        cpf: '123.456.789-00',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'João Pedro Oliveira',
        email: 'joao.oliveira@email.com',
        phone: '(11) 91234-5678',
        cpf: '987.654.321-00',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Ana Carolina Lima',
        email: 'ana.lima@email.com',
        phone: '(11) 99876-5432',
        cpf: '456.789.123-00',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Carlos Eduardo Souza',
        email: 'carlos.souza@email.com',
        phone: '(11) 93456-7890',
        cpf: '789.123.456-00',
      }
    }),
    prisma.customer.create({
      data: {
        name: 'Fernanda Costa Pereira',
        email: 'fernanda.costa@email.com',
        phone: '(11) 94567-8901',
        cpf: '321.654.987-00',
      }
    }),
  ])
  console.log(`✅ ${customers.length} clientes criados`)

  // ========== PRODUTOS ==========
  console.log('\n📦 Criando produtos...')
  
  const products = await Promise.all([
    // ARMAÇÕES
    prisma.product.create({
      data: {
        name: 'Armação Ray-Ban Aviador',
        category: 'Armações',
        price: 899.90,
        costPrice: 450.00,
        stock: 15,
      }
    }),
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
        name: 'Armação Vogue VO5317',
        category: 'Armações',
        price: 459.90,
        costPrice: 230.00,
        stock: 12,
      }
    }),
    
    // LENTES OFTÁLMICAS
    prisma.product.create({
      data: {
        name: 'Lente Varilux Comfort Max',
        category: 'Lentes Oftálmicas',
        price: 1290.00,
        costPrice: 645.00,
        stock: 25,
        labCode: 'VAR-2024-001234',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Lente Zeiss SmartLife Individual',
        category: 'Lentes Oftálmicas',
        price: 1890.00,
        costPrice: 945.00,
        stock: 18,
        labCode: 'ZSL-2024-005678',
      }
    }),
    prisma.product.create({
      data: {
        name: 'Lente Transitions Gen 8',
        category: 'Lentes Oftálmicas',
        price: 450.00,
        costPrice: 225.00,
        stock: 35,
        labCode: 'TR8-2024-009012',
      }
    }),
    
    // LENTES DE CONTATO
    prisma.product.create({
      data: {
        name: 'Lente de Contato Acuvue Oasys',
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
    
    // SOLAR
    prisma.product.create({
      data: {
        name: 'Óculos de Sol Ray-Ban Wayfarer',
        category: 'Óculos de Sol',
        price: 799.90,
        costPrice: 400.00,
        stock: 12,
      }
    }),
    prisma.product.create({
      data: {
        name: 'Óculos de Sol Oakley Frogskins',
        category: 'Óculos de Sol',
        price: 649.90,
        costPrice: 325.00,
        stock: 9,
      }
    }),
    
    // ACESSÓRIOS
    prisma.product.create({
      data: {
        name: 'Estojo para Óculos Premium',
        category: 'Acessórios',
        price: 49.90,
        costPrice: 25.00,
        stock: 100,
      }
    }),
    prisma.product.create({
      data: {
        name: 'Spray Limpa Lentes 60ml',
        category: 'Acessórios',
        price: 29.90,
        costPrice: 15.00,
        stock: 120,
      }
    }),
  ])
  console.log(`✅ ${products.length} produtos criados`)

  // ========== VENDAS ==========
  console.log('\n💰 Criando vendas...')
  
  // Venda 1
  await prisma.sale.create({
    data: {
      userId: user.id,
      customerId: customers[0].id,
      totalAmount: 1349.80,
      status: 'COMPLETED',
      items: {
        create: [
          { productId: products[0].id, quantity: 1, unitPrice: 899.90 },
          { productId: products[3].id, quantity: 1, unitPrice: 349.90 },
        ]
      }
    }
  })

  // Venda 2
  await prisma.sale.create({
    data: {
      userId: user.id,
      customerId: customers[1].id,
      totalAmount: 1890.00,
      status: 'COMPLETED',
      items: {
        create: [
          { productId: products[4].id, quantity: 1, unitPrice: 1890.00 },
        ]
      }
    }
  })

  // Venda 3
  await prisma.sale.create({
    data: {
      userId: user.id,
      customerId: customers[2].id,
      totalAmount: 649.80,
      status: 'COMPLETED',
      items: {
        create: [
          { productId: products[6].id, quantity: 2, unitPrice: 189.90 },
          { productId: products[10].id, quantity: 2, unitPrice: 135.00 },
        ]
      }
    }
  })

  // Venda 4 (Avulsa)
  await prisma.sale.create({
    data: {
      userId: user.id,
      totalAmount: 459.90,
      status: 'COMPLETED',
      items: {
        create: [
          { productId: products[2].id, quantity: 1, unitPrice: 459.90 },
        ]
      }
    }
  })

  // Venda 5
  await prisma.sale.create({
    data: {
      userId: user.id,
      customerId: customers[3].id,
      totalAmount: 2099.80,
      status: 'COMPLETED',
      items: {
        create: [
          { productId: products[3].id, quantity: 1, unitPrice: 1290.00 },
          { productId: products[8].id, quantity: 1, unitPrice: 799.90 },
        ]
      }
    }
  })

  console.log('✅ 5 vendas criadas')

  // ========== RECEITAS ==========
  console.log('\n👓 Criando receitas...')
  
  await Promise.all([
    prisma.prescription.create({
      data: {
        customerId: customers[0].id,
        doctorName: 'Dr. Roberto Silva',
        odSpherical: -2.50,
        odCylindrical: -0.75,
        odAxis: 180,
        oeSpherical: -2.25,
        oeCylindrical: -0.50,
        oeAxis: 175,
        additionOD: 2.00,
        additionOE: 2.00,
      }
    }),
    prisma.prescription.create({
      data: {
        customerId: customers[1].id,
        doctorName: 'Dra. Amanda Costa',
        odSpherical: -1.75,
        odCylindrical: 0,
        odAxis: 0,
        oeSpherical: -1.50,
        oeCylindrical: 0,
        oeAxis: 0,
        additionOD: 1.50,
        additionOE: 1.50,
      }
    }),
  ])
  console.log('✅ 2 receitas criadas')

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('\n📊 Resumo:')
  console.log(`  • ${customers.length} clientes`)
  console.log(`  • ${products.length} produtos`)
  console.log(`  • 5 vendas`)
  console.log(`  • 2 receitas`)
  console.log('\n🔑 Dados de login:')
  console.log('  Email: admin@optigestao.com')
  console.log('  Senha: admin123')
}

main()
  .catch((e) => {
    console.error('\n❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
