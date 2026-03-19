import { prisma } from "../../lib/prisma"
import CustomersClient from "./CustomersClient"
import { unstable_noStore as noStore } from "next/cache"

export default async function CustomersPage() {
  noStore()
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  })

  return <CustomersClient initialCustomers={customers} />
}
