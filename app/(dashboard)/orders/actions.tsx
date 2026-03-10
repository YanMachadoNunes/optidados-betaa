import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const orderSchema = z.object({
  customerId: z.string(),
  prescriptionId: z.string().optional(),
  frameId: z.string().optional(),
  totalAmount: z.number(),
  status: z.enum(["PENDING", "IN_ASSEMBLY", "READY", "DELIVERED"]),
  paymentMethod: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
    })
  ),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const createOrder = async (data: OrderInput) => {
  return await prisma.order.create({
    data,
    include: {
      customer: true,
      prescription: true,
      frame: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const getOrder = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      prescription: true,
      frame: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const updateOrder = async (id: string, data: Partial<OrderInput>) => {
  return await prisma.order.update({
    where: { id },
    data,
    include: {
      customer: true,
      prescription: true,
      frame: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const deleteOrder = async (id: string) => {
  return await prisma.order.delete({
    where: { id },
  });
};

export const getOrders = async (status?: string) => {
  const where = status ? { status } : {};
  return await prisma.order.findMany({
    where,
    include: {
      customer: true,
      prescription: true,
      frame: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getOrdersByCustomer = async (customerId: string) => {
  return await prisma.order.findMany({
    where: { customerId },
    include: {
      customer: true,
      prescription: true,
      frame: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getOrdersCountByStatus = async () => {
  return await prisma.order.groupBy({
    by: ["status"],
    _count: {},
  });
};

export const getCustomers = async () => {
  return await prisma.customer.findMany({
    select: { id: true, name: true },
  });
};

export const getProducts = async () => {
  return await prisma.product.findMany({
    where: { category: "ARMACAO" },
    select: { id: true, name: true, price: true },
  });
};

export const getPrescriptions = async () => {
  return await prisma.prescription.findMany({
    include: { customer: true },
  });
};