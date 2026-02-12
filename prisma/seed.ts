import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpa dados existentes
  await prisma.saleItem.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.prescription.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()

  console.log('✅ Dados anteriores removidos')

  // ========== CLIENTES ==========
  const customers = await prisma.customer.createMany({
    data: [
      {
        name: 'Maria Silva Santos',
        email: 'maria.silva@email.com',
        phone: '(11) 98765-4321',
        cpf: '123.456.789-00',
      },
      {
        name: 'João Pedro Oliveira',
        email: 'joao.oliveira@email.com',
        phone: '(11) 91234-5678',
        cpf: '987.654.321-00',
      },
      {
        name: 'Ana Carolina Lima',
        email: 'ana.lima@email.com',
        phone: '(11) 99876-5432',
        cpf: '456.789.123-00',
      },
      {
        name: 'Carlos Eduardo Souza',
        email: 'carlos.souza@email.com',
        phone: '(11) 93456-7890',
        cpf: '789.123.456-00',
      },
      {
        name: 'Fernanda Costa Pereira',
        email: 'fernanda.costa@email.com',
        phone: '(11) 94567-8901',
        cpf: '321.654.987-00',
      },
      {
        name: 'Ricardo Almeida Junior',
        email: 'ricardo.almeida@email.com',
        phone: '(11) 95678-9012',
        cpf: '654.987.321-00',
      },
      {
        name: 'Juliana Martins Rocha',
        email: 'juliana.martins@email.com',
        phone: '(11) 96789-0123',
        cpf: '147.258.369-00',
      },
      {
        name: 'Bruno Henrique Dias',
        email: 'bruno.dias@email.com',
        phone: '(11) 97890-1234',
        cpf: '369.258.147-00',
      },
      {
        name: 'Patricia Mendes Lopes',
        email: 'patricia.mendes@email.com',
        phone: '(11) 98901-2345',
        cpf: '852.741.963-00',
      },
      {
        name: 'Lucas Gabriel Fernandes',
        email: 'lucas.fernandes@email.com',
        phone: '(11) 99012-3456',
        cpf: '741.852.963-00',
      },
      {
        name: 'Mariana Castro Silva',
        email: 'mariana.castro@email.com',
        phone: '(11) 90123-4567',
        cpf: '159.753.486-00',
      },
      {
        name: 'Pedro Henrique Lima',
        email: 'pedro.lima@email.com',
        phone: '(11) 91234-5679',
        cpf: '357.951.642-00',
      },
      {
        name: 'Camila Rodrigues Dias',
        email: 'camila.rodrigues@email.com',
        phone: '(11) 92345-6789',
        cpf: '951.357.852-00',
      },
      {
        name: 'Gustavo Henrique Souza',
        email: 'gustavo.souza@email.com',
        phone: '(11) 93456-7891',
        cpf: '753.159.486-00',
      },
      {
        name: 'Amanda Oliveira Costa',
        email: 'amanda.costa@email.com',
        phone: '(11) 94567-8912',
        cpf: '486.159.753-00',
      },
    ],
  })

  console.log(`✅ ${customers.count} clientes criados`)

  // ========== PRODUTOS ==========
  const products = await prisma.product.createMany({
    data: [
      // ARMAÇÕES
      {
        name: 'Armação Ray-Ban Aviador',
        category: 'Armações',
        price: 899.90,
        costPrice: 450.00,
        stock: 15,
      },
      {
        name: 'Armação Oakley Holbrook',
        category: 'Armações',
        price: 749.90,
        costPrice: 375.00,
        stock: 8,
      },
      {
        name: 'Armação Vogue VO5317',
        category: 'Armações',
        price: 459.90,
        costPrice: 230.00,
        stock: 12,
      },
      {
        name: 'Armação Persol PO0714',
        category: 'Armações',
        price: 1299.90,
        costPrice: 650.00,
        stock: 5,
      },
      {
        name: 'Armação Guess GU2723',
        category: 'Armações',
        price: 389.90,
        costPrice: 195.00,
        stock: 20,
      },
      {
        name: 'Armação Calvin Klein CK18513',
        category: 'Armações',
        price: 599.90,
        costPrice: 300.00,
        stock: 10,
      },
      {
        name: 'Armação Lacoste L2603ND',
        category: 'Armações',
        price: 529.90,
        costPrice: 265.00,
        stock: 7,
      },
      
      // LENTES OFTÁLMICAS
      {
        name: 'Lente Varilux Comfort Max',
        category: 'Lentes Oftálmicas',
        price: 1290.00,
        costPrice: 645.00,
        stock: 25,
      },
      {
        name: 'Lente Zeiss SmartLife Individual',
        category: 'Lentes Oftálmicas',
        price: 1890.00,
        costPrice: 945.00,
        stock: 18,
      },
      {
        name: 'Lente Hoya Sync III',
        category: 'Lentes Oftálmicas',
        price: 890.00,
        costPrice: 445.00,
        stock: 30,
      },
      {
        name: 'Lente Kodak Precise PB',
        category: 'Lentes Oftálmicas',
        price: 590.00,
        costPrice: 295.00,
        stock: 40,
      },
      {
        name: 'Lente Transitions Gen 8',
        category: 'Lentes Oftálmicas',
        price: 450.00,
        costPrice: 225.00,
        stock: 35,
      },
      {
        name: 'Lente Blue Cut Anti Reflexo',
        category: 'Lentes Oftálmicas',
        price: 320.00,
        costPrice: 160.00,
        stock: 50,
      },
      
      // LENTES DE CONTATO
      {
        name: 'Lente de Contato Acuvue Oasys',
        category: 'Lentes de Contato',
        price: 189.90,
        costPrice: 95.00,
        stock: 60,
      },
      {
        name: 'Lente de Contato Biofinity',
        category: 'Lentes de Contato',
        price: 159.90,
        costPrice: 80.00,
        stock: 45,
      },
      {
        name: 'Lente de Contato Air Optix',
        category: 'Lentes de Contato',
        price: 139.90,
        costPrice: 70.00,
        stock: 55,
      },
      {
        name: 'Lente de Contato Dailies Total 1',
        category: 'Lentes de Contato',
        price: 219.90,
        costPrice: 110.00,
        stock: 40,
      },
      
      // SOLAR
      {
        name: 'Óculos de Sol Ray-Ban Wayfarer',
        category: 'Óculos de Sol',
        price: 799.90,
        costPrice: 400.00,
        stock: 12,
      },
      {
        name: 'Óculos de Sol Oakley Frogskins',
        category: 'Óculos de Sol',
        price: 649.90,
        costPrice: 325.00,
        stock: 9,
      },
      {
        name: 'Óculos de Sol Carrera 5512',
        category: 'Óculos de Sol',
        price: 459.90,
        costPrice: 230.00,
        stock: 14,
      },
      
      // ACESSÓRIOS
      {
        name: 'Estojo para Óculos Premium',
        category: 'Acessórios',
        price: 49.90,
        costPrice: 25.00,
        stock: 100,
      },
      {
        name: 'Corrente para Óculos',
        category: 'Acessórios',
        price: 39.90,
        costPrice: 20.00,
        stock: 80,
      },
      {
        name: 'Spray Limpa Lentes 60ml',
        category: 'Acessórios',
        price: 29.90,
        costPrice: 15.00,
        stock: 120,
      },
      {
        name: 'Flanela Microfibra',
        category: 'Acessórios',
        price: 15.90,
        costPrice: 8.00,
        stock: 200,
      },
      {
        name: 'Kit de Parafusos e Buchas',
        category: 'Acessórios',
        price: 19.90,
        costPrice: 10.00,
        stock: 150,
      },
      {
        name: 'Plaqueta Silicone Adesiva',
        category: 'Acessórios',
        price: 9.90,
        costPrice: 5.00,
        stock: 300,
      },
    ],
  })

  console.log(`✅ ${products.count} produtos criados`)

  // Buscar clientes criados para usar nas vendas
  const allCustomers = await prisma.customer.findMany()
  const allProducts = await prisma.product.findMany()

  // Criar algumas vendas de exemplo
  const salesData = [
    {
      customerId: allCustomers[0].id,
      totalAmount: 1349.80,
      status: 'COMPLETED',
      items: [
        { productId: allProducts.find(p => p.name.includes('Ray-Ban Aviador'))!.id, quantity: 1, unitPrice: 899.90 },
        { productId: allProducts.find(p => p.name.includes('Estojo'))!.id, quantity: 1, unitPrice: 49.90 },
        { productId: allProducts.find(p => p.name.includes('Spray'))!.id, quantity: 2, unitPrice: 29.90 },
      ]
    },
    {
      customerId: allCustomers[1].id,
      totalAmount: 1890.00,
      status: 'COMPLETED',
      items: [
        { productId: allProducts.find(p => p.name.includes('Zeiss'))!.id, quantity: 1, unitPrice: 1890.00 },
      ]
    },
    {
      customerId: allCustomers[2].id,
      totalAmount: 649.80,
      status: 'COMPLETED',
      items: [
        { productId: allProducts.find(p => p.name.includes('Acuvue'))!.id, quantity: 2, unitPrice: 189.90 },
        { productId: allProducts.find(p => p.name.includes('Solução'))?.id || allProducts[0].id, quantity: 2, unitPrice: 135.00 },
      ]
    },
    {
      customerId: allCustomers[3].id,
      totalAmount: 2099.80,
      status: 'COMPLETED',
      items: [
        { productId: allProducts.find(p => p.name.includes('Varilux'))!.id, quantity: 1, unitPrice: 1290.00 },
        { productId: allProducts.find(p => p.name.includes('Persol'))!.id, quantity: 1, unitPrice: 1299.90 },
      ]
    },
    {
      customerId: null, // Venda avulsa
      totalAmount: 459.90,
      status: 'COMPLETED',
      items: [
        { productId: allProducts.find(p => p.name.includes('Carrera'))!.id, quantity: 1, unitPrice: 459.90 },
      ]
    },
  ]

  // Criar vendas
  for (const saleData of salesData) {
    await prisma.sale.create({
      data: {
        customerId: saleData.customerId,
        totalAmount: saleData.totalAmount,
        status: saleData.status,
        items: {
          create: saleData.items
        }
      }
    })
  }

  console.log(`✅ ${salesData.length} vendas criadas`)

  // Criar receitas para alguns clientes
  const prescriptions = await prisma.prescription.createMany({
    data: [
      {
        customerId: allCustomers[0].id,
        doctorName: 'Dr. Roberto Silva',
        odSpherical: -2.50,
        odCylindrical: -0.75,
        odAxis: 180,
        oeSpherical: -2.25,
        oeCylindrical: -0.50,
        oeAxis: 175,
        addition: 2.00,
      },
      {
        customerId: allCustomers[1].id,
        doctorName: 'Dra. Amanda Costa',
        odSpherical: -1.75,
        odCylindrical: 0,
        odAxis: 0,
        oeSpherical: -1.50,
        oeCylindrical: 0,
        oeAxis: 0,
        addition: 1.50,
      },
      {
        customerId: allCustomers[2].id,
        doctorName: 'Dr. Carlos Mendes',
        odSpherical: -3.00,
        odCylindrical: -1.25,
        odAxis: 90,
        oeSpherical: -2.75,
        oeCylindrical: -1.00,
        oeAxis: 85,
        addition: 0,
      },
    ],
  })

  console.log(`✅ ${prescriptions.count} receitas criadas`)

  console.log('\n🎉 Seed concluído com sucesso!')
  console.log('\nResumo:')
  console.log(`- ${customers.count} clientes`)
  console.log(`- ${products.count} produtos`)
  console.log(`- ${salesData.length} vendas`)
  console.log(`- ${prescriptions.count} receitas`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
