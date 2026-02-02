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
    include: {
      prescriptions: {
        orderBy: { examDate: "desc" }, // As mais recentes primeiro
      },
    },
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
                <div
                  style={{
                    marginTop: "2rem",
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "2rem",
                  }}
                >
                  <div
                    className={style.header}
                    style={{ marginBottom: "1rem" }}
                  >
                    <h2
                      className={style.sectionTitle}
                      style={{ border: "none", margin: 0 }}
                    >
                      Histórico de Visão
                    </h2>
                    <Link
                      href={`/customers/${customer.id}/prescriptions/new`}
                      className={style.editButton} // Reutilizando seu estilo de botão
                      style={{
                        background: "#0f172a",
                        color: "white",
                        borderColor: "#0f172a",
                      }}
                    >
                      + Nova Receita
                    </Link>
                  </div>

                  {customer.prescriptions.length === 0 ? (
                    <div
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "#64748b",
                        background: "#f8fafc",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <p>Nenhuma receita cadastrada para este cliente.</p>
                      <small>
                        Clique em "Nova Receita" para lançar o primeiro exame.
                      </small>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "1rem" }}>
                      {customer.prescriptions.map((rx) => (
                        <div
                          key={rx.id}
                          style={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "0.75rem",
                            padding: "1rem",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#fff",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>
                              {new Date(rx.examDate).toLocaleDateString(
                                "pt-BR",
                              )}
                            </div>
                            <div
                              style={{ fontSize: "0.85rem", color: "#64748b" }}
                            >
                              Dr(a). {rx.doctorName || "Não informado"}
                            </div>
                          </div>

                          {/* Resumo Rápido dos Graus */}
                          <div
                            style={{
                              display: "flex",
                              gap: "2rem",
                              fontSize: "0.9rem",
                            }}
                          >
                            <div>
                              <span
                                style={{
                                  color: "#94a3b8",
                                  fontSize: "0.75rem",
                                }}
                              >
                                OD
                              </span>
                              <div style={{ fontFamily: "monospace" }}>
                                {Number(rx.odSpherical).toFixed(2)} /{" "}
                                {Number(rx.odCylindrical).toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <span
                                style={{
                                  color: "#94a3b8",
                                  fontSize: "0.75rem",
                                }}
                              >
                                OE
                              </span>
                              <div style={{ fontFamily: "monospace" }}>
                                {Number(rx.oeSpherical).toFixed(2)} /{" "}
                                {Number(rx.oeCylindrical).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
