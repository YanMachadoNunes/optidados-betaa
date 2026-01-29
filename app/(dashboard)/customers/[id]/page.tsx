import { prisma } from "../../../lib/prisma"; // Caminho relativo padrão
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCustomer } from "../actions";
import style from "./page.module.css"; // Importando o CSS do Dossie

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function CustomerDetailsPage({ params }: Props) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        {/* Navegação */}
        <div className={style.header}>
          <Link href="/customers" className={style.backLink}>
            <span>←</span> Voltar para Lista
          </Link>
          <span className={style.headerTitle}>ID: {customer.id.slice(-6)}</span>
        </div>

        {/* Card Dossiê */}
        <div className={style.card}>
          {/* Topo: Foto e Nome */}
          <div className={style.cardTop}>
            <div className={style.profileBlock}>
              <div className={style.avatar}>{getInitials(customer.name)}</div>
              <div>
                <h1 className={style.name}>{customer.name}</h1>
                <span className={style.activeBadge}>Cliente Ativo</span>
              </div>
            </div>

            <div className={style.actions}>
              <Link
                href={`/customers/${customer.id}/edit`}
                className={style.editButton}
              >
                Editar Dados
              </Link>

              <form
                action={async () => {
                  "use server";
                  await deleteCustomer(customer.id);
                }}
              >
                <button type="submit" className={style.deleteButton}>
                  Excluir
                </button>
              </form>
            </div>
          </div>

          {/* Corpo: Dados Técnicos */}
          <div className={style.cardBody}>
            {/* Coluna 1 */}
            <div>
              <h2 className={style.sectionTitle}>Contato</h2>
              <div className={style.infoGroup}>
                <span className={style.label}>E-mail</span>
                <div className={style.value}>{customer.email}</div>
              </div>
              <div className={style.infoGroup}>
                <span className={style.label}>Telefone</span>
                <div className={style.value}>{customer.phone || "—"}</div>
              </div>
            </div>

            {/* Coluna 2 */}
            <div>
              <h2 className={style.sectionTitle}>Documentação</h2>
              <div className={style.infoGroup}>
                <span className={style.label}>CPF</span>
                <div className={`${style.value} ${style.valueMono}`}>
                  {customer.cpf || "Não registrado"}
                </div>
              </div>
              <div className={style.infoGroup}>
                <span className={style.label}>Data de Cadastro</span>
                <div className={style.value}>
                  {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
