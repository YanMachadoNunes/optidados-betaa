import { prisma } from "../../../../../lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPrescription } from "../../../actions";
import style from "./page.module.css";
import { unstable_noStore as noStore } from "next/cache";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewPrescriptionPage({ params }: Props) {
  noStore();
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!customer) notFound();

  return (
    <div className={style.pageWrapper}>
      <form action={createPrescription} className={style.container}>
        <input type="hidden" name="customerId" value={customer.id} />

        <div className={style.card}>
          <div className={style.header}>
            <h1 className={style.title}>Nova Receita</h1>
            <p className={style.subtitle}>
              Lançando exame para: <strong>{customer.name}</strong>
            </p>
          </div>

          <div className={style.medicalData}>
            <div className={style.field}>
              <label className={style.label}>Médico / Optometrista</label>
              <input
                type="text"
                name="doctorName"
                className={style.input}
                placeholder="Nome do médico"
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

          <div className={style.attachmentSection}>
            <label>Anexar Receita (PDF ou Imagem)</label>
            <input
              type="file"
              name="attachment"
              accept=".pdf,.jpg,.jpeg,.png"
              className={style.fileInput}
            />
            <span className={style.fileHint}>
              Aceita arquivos PDF, JPG ou PNG (máx. 5MB)
            </span>
          </div>

          <div className={style.opticalGrid}>
            {/* OD */}
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
                  <label className={style.label}>Eixo</label>
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
              <div className={`${style.field} ${style.fieldFull}`}>
                <label className={style.label}>Adição (Perto)</label>
                <input
                  type="number"
                  step="0.25"
                  name="additionOD"
                  className={style.input}
                  placeholder="+0.00"
                />
              </div>
            </div>

            {/* OE */}
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
                  <label className={style.label}>Eixo</label>
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
              <div className={`${style.field} ${style.fieldFull}`}>
                <label className={style.label}>Adição (Perto)</label>
                <input
                  type="number"
                  step="0.25"
                  name="additionOE"
                  className={style.input}
                  placeholder="+0.00"
                />
              </div>
            </div>
          </div>

          <div className={style.footer}>
            <Link href={`/customers/${customer.id}`} className={style.btnCancel}>
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
