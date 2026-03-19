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

  const allProducts = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })

  const products = allProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    stock: p.stock,
    category: p.category,
  }))

  const categories = Array.from(new Set(allProducts.map(p => p.category))) as string[]

  return (
    <NewOrderForm 
      customers={customers} 
      products={products}
      categories={categories}
    />
  )
}
