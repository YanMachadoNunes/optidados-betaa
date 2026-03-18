import { prisma } from "@/lib/prisma"
import NewOrderForm from "./NewOrderForm"

export const dynamic = "force-dynamic"

export default async function NewOrderPage() {
  const customersRaw = await prisma.customer.findMany({
    select: { id: true, name: true, phone: true },
    orderBy: { name: "asc" },
  })

  const customers = customersRaw.map(c => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
  }))

  const framesRaw = await prisma.product.findMany({
    where: { category: "Armações" },
    orderBy: { name: "asc" },
  })

  const frames = framesRaw.map(f => ({
    id: f.id,
    name: f.name,
    price: Number(f.price),
    stock: f.stock,
  }))

  const lensesRaw = await prisma.product.findMany({
    where: { 
      category: {
        in: ["Lentes Oftálmicas", "Lentes de Contato"]
      }
    },
    orderBy: { name: "asc" },
  })

  const lenses = lensesRaw.map(l => ({
    id: l.id,
    name: l.name,
    price: Number(l.price),
  }))

  return (
    <NewOrderForm 
      customers={customers} 
      frames={frames} 
      lenses={lenses} 
    />
  )
}
