import { getOrders } from "./actions";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

function serializeOrder(order: any) {
  return {
    ...order,
    totalAmount: Number(order.totalAmount),
    createdAt: order.createdAt?.toISOString(),
    updatedAt: order.updatedAt?.toISOString(),
    customer: order.customer ? {
      ...order.customer,
      createdAt: order.customer.createdAt?.toISOString(),
    } : null,
    frame: order.frame ? {
      ...order.frame,
      price: Number(order.frame.price),
      costPrice: Number(order.frame.costPrice),
      createdAt: order.frame.createdAt?.toISOString(),
      updatedAt: order.frame.updatedAt?.toISOString(),
    } : null,
    prescription: order.prescription ? {
      ...order.prescription,
      odSpherical: order.prescription.odSpherical ? Number(order.prescription.odSpherical) : null,
      odCylindrical: order.prescription.odCylindrical ? Number(order.prescription.odCylindrical) : null,
      oeSpherical: order.prescription.oeSpherical ? Number(order.prescription.oeSpherical) : null,
      oeCylindrical: order.prescription.oeCylindrical ? Number(order.prescription.oeCylindrical) : null,
      addition: order.prescription.addition ? Number(order.prescription.addition) : null,
      createdAt: order.prescription.createdAt?.toISOString(),
    } : null,
    items: order.items?.map((item: any) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      createdAt: item.createdAt?.toISOString(),
      product: item.product ? {
        ...item.product,
        price: Number(item.product.price),
        costPrice: Number(item.product.costPrice),
        createdAt: item.product.createdAt?.toISOString(),
        updatedAt: item.product.updatedAt?.toISOString(),
      } : null,
    })) || [],
  };
}

export default async function OrdersPage() {
  const orders = await getOrders();
  
  const serializedOrders = orders.map(serializeOrder);
  
  const counts = {
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    IN_ASSEMBLY: orders.filter((o) => o.status === "IN_ASSEMBLY").length,
    READY: orders.filter((o) => o.status === "READY").length,
    DELIVERED: orders.filter((o) => o.status === "DELIVERED").length,
    total: orders.length,
  };

  return <OrdersClient orders={serializedOrders} counts={counts} />;
}
