import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteCustomer } from "../actions";
import style from "./page.module.css";
import { unstable_noStore as noStore } from "next/cache";
import { Eye, Phone, Mail, FileText, Calendar, User, Edit2, Trash2, Plus } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
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
  noStore();
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      prescriptions: {
        orderBy: { examDate: "desc" },
      },
      sales: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <div className={style.header}>
          <Link href="/customers" className={style.backLink}>
            ← Voltar para Lista
          </Link>
          <span className={style.headerId}>ID: {customer.id.slice(-6)}</span>
        </div>

        {/* Card Principal */}
        <div className={style.card}>
          <div className={style.cardTop}>
            <div className={style.profileBlock}>
              <div className={style.avatar}>{getInitials(customer.name)}</div>
              <div>
                <h1 className={style.name}>{customer.name}</h1>
                <span className={style.activeBadge}>Cliente Ativo</span>
              </div>
            </div>

            <div className={style.actions}>
              <Link href={`/customers/${customer.id}/edit`} className={style.editBtn}>
                <Edit2 size={16} />
                Editar
              </Link>
              <form action={async () => {
                "use server";
                await deleteCustomer(customer.id);
              }}>
                <button type="submit" className={style.deleteBtn}>
                  <Trash2 size={16} />
                  Excluir
                </button>
              </form>
            </div>
          </div>

          <div className={style.cardBody}>
            <div className={style.infoColumn}>
              <h2 className={style.sectionTitle}>Informações de Contato</h2>
              <div className={style.infoItem}>
                <Mail size={16} />
                <span>{customer.email || "Não cadastrado"}</span>
              </div>
              <div className={style.infoItem}>
                <Phone size={16} />
                <span>{customer.phone || "Não cadastrado"}</span>
              </div>
              <div className={style.infoItem}>
                <User size={16} />
                <span>CPF: {customer.cpf || "Não cadastrado"}</span>
              </div>
              <div className={style.infoItem}>
                <Calendar size={16} />
                <span>Desde {new Date(customer.createdAt).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>

            <div className={style.infoColumn}>
              <h2 className={style.sectionTitle}>Histórico de Receitas</h2>
              <Link href={`/customers/${customer.id}/prescriptions/new`} className={style.newPrescriptionBtn}>
                <Plus size={16} />
                Nova Receita
              </Link>

              {customer.prescriptions.length === 0 ? (
                <div className={style.emptyPrescription}>
                  <FileText size={32} />
                  <p>Nenhuma receita cadastrada</p>
                </div>
              ) : (
                <div className={style.prescriptionList}>
                  {customer.prescriptions.map((rx) => (
                    <div key={rx.id} className={style.prescriptionItem}>
                      <div className={style.rxHeader}>
                        <div className={style.rxDate}>
                          <Calendar size={14} />
                          {new Date(rx.examDate).toLocaleDateString("pt-BR")}
                        </div>
                        <Link href={`/customers/${customer.id}/prescriptions/${rx.id}`} className={style.viewRxBtn}>
                          <Eye size={14} />
                          Ver
                        </Link>
                      </div>
                      <div className={style.rxDoctor}>
                        Dr(a). {rx.doctorName || "Não informado"}
                      </div>
                      <div className={style.rxGrades}>
                        <div className={style.rxEye}>
                          <span className={style.rxBadgeOD}>OD</span>
                          <span>ESF: {Number(rx.odSpherical).toFixed(2)} | CIL: {Number(rx.odCylindrical).toFixed(2)} | E: {rx.odAxis}°</span>
                        </div>
                        <div className={style.rxEye}>
                          <span className={style.rxBadgeOE}>OE</span>
                          <span>ESF: {Number(rx.oeSpherical).toFixed(2)} | CIL: {Number(rx.oeCylindrical).toFixed(2)} | E: {rx.oeAxis}°</span>
                        </div>
                        {(Number(rx.additionOD) > 0 || Number(rx.additionOE) > 0) && (
                          <div className={style.rxAdd}>
                            ADIÇÃO: OD {Number(rx.additionOD).toFixed(2)} | OE {Number(rx.additionOE).toFixed(2)}
                          </div>
                        )}
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
  );
}
