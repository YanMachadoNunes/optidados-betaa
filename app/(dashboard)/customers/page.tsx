import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { deleteCustomer } from "./actions";
import style from "./page.module.css";
import { unstable_noStore as noStore } from "next/cache";
import { 
  Users, 
  Plus, 
  Phone, 
  Mail, 
  Trash2, 
  ArrowRight,
  User
} from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function CustomersPage() {
  noStore();
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={style.container}>
      {/* Header */}
      <header className={style.header}>
        <div>
          <h1 className={style.title}>Clientes</h1>
          <p className={style.subtitle}>
            Gerencie sua base de clientes e acompanhe o histórico.
          </p>
        </div>
        <Link href="/customers/new" className={style.addButton}>
          <Plus size={20} />
          <span>Novo Cliente</span>
        </Link>
      </header>

      {/* Stats */}
      <div className={style.statsBar}>
        <div className={style.statItem}>
          <Users size={20} className={style.statIcon} />
          <span className={style.statValue}>{customers.length}</span>
          <span className={style.statLabel}>clientes cadastrados</span>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className={style.grid}>
        {customers.map((customer) => (
          <div key={customer.id} className={style.card}>
            {/* Topo do Card */}
            <div className={style.cardTop}>
              <div className={style.avatar}>{getInitials(customer.name)}</div>
              <div className={style.clientInfo}>
                <Link
                  href={`/customers/${customer.id}`}
                  className={style.clientName}
                >
                  {customer.name}
                </Link>
                <div className={style.clientMeta}>
                  <span className={style.metaItem}>
                    <Mail size={14} />
                    {customer.email || "Sem email"}
                  </span>
                </div>
              </div>
            </div>

            {/* Base do Card */}
            <div className={style.cardBottom}>
              <div className={style.metaInfo}>
                <span className={style.clientPhone}>
                  <Phone size={14} />
                  {customer.phone || "Sem telefone"}
                </span>
                <span className={style.clientCpf}>
                  {customer.cpf || "DOC N/A"}
                </span>
              </div>

              <div className={style.cardActions}>
                <Link
                  href={`/customers/${customer.id}`}
                  className={style.viewButton}
                  title="Ver detalhes"
                >
                  <ArrowRight size={18} />
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteCustomer(customer.id);
                  }}
                >
                  <button
                    type="submit"
                    className={style.deleteButton}
                    title="Excluir Cliente"
                  >
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {customers.length === 0 && (
          <div className={style.emptyState}>
            <User size={64} className={style.emptyIcon} />
            <h3 className={style.emptyTitle}>Nenhum cliente cadastrado</h3>
            <p className={style.emptyText}>
              Comece adicionando seu primeiro cliente para gerenciar sua carteira.
            </p>
            <Link href="/customers/new" className={style.emptyButton}>
              <Plus size={18} />
              Adicionar Cliente
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
