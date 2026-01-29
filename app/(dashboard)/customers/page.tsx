import { prisma } from "../../lib/prisma";
import Link from "next/link";
import { deleteCustomer } from "./actions";
import style from "./page.module.css";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Envolvemos tudo numa div pageWrapper para forçar o fundo claro
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        {/* Cabeçalho Imperial */}
        <div className={style.header}>
          <div className={style.titleBlock}>
            <h1 className={style.title}>Meus Clientes</h1>
            <p className={style.subtitle}>
              Gestão de alto nível da sua carteira.
            </p>
          </div>
          <Link href="/customers/new" className={style.addButton}>
            <span style={{ fontSize: "1.5rem", lineHeight: 0 }}>+</span> Novo
            Registro
          </Link>
        </div>

        {/* Grid de Cards */}
        <div className={style.grid}>
          {customers.map((customer) => (
            // Cada cliente agora é um CARD individual
            <div key={customer.id} className={style.card}>
              {/* Topo do Card: Avatar e Nome */}
              <div className={style.cardTop}>
                <div className={style.avatar}>{getInitials(customer.name)}</div>
                <div className={style.clientInfo}>
                  <Link
                    href={`/customers/${customer.id}`}
                    className={style.clientName}
                  >
                    {customer.name}
                  </Link>
                  <span className={style.clientEmail}>{customer.email}</span>
                </div>
              </div>

              {/* Base do Card: Contato e Ações */}
              <div className={style.cardBottom}>
                <div className={style.metaInfo}>
                  <span className={style.clientPhone}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {customer.phone || "Sem telefone"}
                  </span>
                  <span className={style.clientCpf}>
                    {customer.cpf || "DOC N/A"}
                  </span>
                </div>

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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          ))}

          {customers.length === 0 && (
            <div className={style.emptyState}>
              <p className={style.emptyTitle}>Sua base está vazia.</p>
              <p style={{ color: "#94a3b8" }}>
                Adicione o primeiro cliente para começar a construir seu
                império.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
