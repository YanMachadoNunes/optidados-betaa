import { prisma } from "../../../../../lib/prisma"; // Ajuste os .. conforme sua pasta
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPrescription } from "../../../actions"; // Ajuste o import
import style from "./page.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewPrescriptionPage({ params }: Props) {
  const { id } = await params;

  // Busca o cliente só pra mostrar o nome no topo
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!customer) notFound();

  return (
    <div className={style.pageWrapper}>
      <form action={createPrescription} className={style.container}>
        {/* Input escondido para enviar o ID do cliente */}
        <input type="hidden" name="customerId" value={customer.id} />

        <div className={style.card}>
          {/* Cabeçalho */}
          <div className={style.header}>
            <h1 className={style.title}>Nova Receita</h1>
            <p className={style.subtitle}>
              Lançando exame para: <strong>{customer.name}</strong>
            </p>
          </div>

          {/* Dados Médicos Gerais */}
          <div
            style={{
              padding: "2rem",
              borderBottom: "1px solid #e2e8f0",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className={style.field}>
              <label className={style.label}>Médico / Optometrista</label>
              <input
                type="text"
                name="doctorName"
                className={style.input}
                placeholder="Ex: Dr. Estranho"
              />
            </div>
            <div className={style.field}>
              <label className={style.label}>Data do Exame</label>
              <input
                type="date"
                name="examDate"
                className={style.input}
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className={style.field}>
              <label className={style.label}>Validade (Opcional)</label>
              <input type="date" name="dueDate" className={style.input} />
            </div>
          </div>

          {/* O Grande Grid Ótico */}
          <div className={style.opticalGrid}>
            {/* --- OLHO DIREITO (OD) --- */}
            <div className={`${style.eyeBlock} ${style.rightEye}`}>
              <div className={style.eyeTitle}>
                <span className={style.badgeOD}>OD</span> Olho Direito
              </div>

              <div className={style.row}>
                <div className={style.field}>
                  <label className={style.label}>Esférico</label>
                  <input
                    type="number"
                    step="0.25"
                    name="odSpherical"
                    className={style.input}
                    placeholder="0.00"
                  />
                </div>
                <div className={style.field}>
                  <label className={style.label}>Cilíndrico</label>
                  <input
                    type="number"
                    step="0.25"
                    name="odCylindrical"
                    className={style.input}
                    placeholder="0.00"
                  />
                </div>
                <div className={style.field}>
                  <label className={style.label}>Eixo (0-180)</label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    name="odAxis"
                    className={style.input}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className={style.field}>
                <label className={style.label}>Adição (Perto)</label>
                <input
                  type="number"
                  step="0.25"
                  name="addition"
                  className={style.input}
                  placeholder="+0.00"
                />
              </div>
            </div>

            {/* --- OLHO ESQUERDO (OE) --- */}
            <div className={`${style.eyeBlock} ${style.leftEye}`}>
              <div className={style.eyeTitle}>
                <span className={style.badgeOE}>OE</span> Olho Esquerdo
              </div>

              <div className={style.row}>
                <div className={style.field}>
                  <label className={style.label}>Esférico</label>
                  <input
                    type="number"
                    step="0.25"
                    name="oeSpherical"
                    className={style.input}
                    placeholder="0.00"
                  />
                </div>
                <div className={style.field}>
                  <label className={style.label}>Cilíndrico</label>
                  <input
                    type="number"
                    step="0.25"
                    name="oeCylindrical"
                    className={style.input}
                    placeholder="0.00"
                  />
                </div>
                <div className={style.field}>
                  <label className={style.label}>Eixo (0-180)</label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    name="oeAxis"
                    className={style.input}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé com Botões */}
          <div className={style.footer}>
            <Link
              href={`/customers/${customer.id}`}
              className={style.btnCancel}
            >
              Cancelar
            </Link>
            <button type="submit" className={style.btnSave}>
              Salvar Receita
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
