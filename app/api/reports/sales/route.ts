import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get("format") || "csv";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const where: any = {};
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const sales = await prisma.sale.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, phone: true } },
      user: { select: { name: true } },
      items: {
        include: {
          product: { select: { name: true } }
        }
      }
    }
  });

  if (format === "json") {
    return NextResponse.json(sales);
  }

  const headers = ["Data", "Cliente", "Telefone", "Vendedor", "Forma de Pagamento", "Status", "Valor Total"];
  const rows = sales.map(sale => [
    new Date(sale.createdAt).toLocaleDateString("pt-BR"),
    sale.customer?.name || "Venda Avulsa",
    sale.customer?.phone || "-",
    sale.user?.name || "-",
    sale.paymentMethod || "-",
    sale.status,
    Number(sale.totalAmount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  ]);

  const csvContent = [
    headers.join(";"),
    ...rows.map(row => row.join(";"))
  ].join("\n");

  const totalGeral = sales.reduce((acc, s) => acc + Number(s.totalAmount), 0);
  const csvComTotais = csvContent + 
    `\n\nTotal de Vendas: ${sales.length}` +
    `\nValor Total: R$ ${totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  const response = new NextResponse(csvComTotais, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="relatorio-vendas-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });

  return response;
}
