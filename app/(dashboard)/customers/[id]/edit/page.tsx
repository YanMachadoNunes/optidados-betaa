import { prisma } from "../../../../lib/prisma";
import { updateCustomer } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import style from "./page.module.css";
import { unstable_noStore as noStore } from "next/cache";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  noStore();
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id: id },
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
          <h1 className={style.title}>Editar Cliente</h1>
        </div>

        <div className={style.formCard}>
          <form action={updateCustomer} className={style.formGrid}>
            <input type="hidden" name="id" value={customer.id} />

            <div className={style.formGroup}>
              <label className={style.label}>Nome Completo *</label>
              <input
                name="name"
                type="text"
                defaultValue={customer.name}
                required
                placeholder="Ex: Yan Maestro"
                className={style.input}
              />
            </div>

            <div className={style.row}>
              <div className={style.formGroup}>
                <label className={style.label}>E-mail</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={customer.email ?? ""}
                  placeholder="email@exemplo.com"
                  className={style.input}
                />
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Telefone / WhatsApp</label>
                <input
                  name="phone"
                  type="text"
                  defaultValue={customer.phone || ""}
                  placeholder="(11) 99999-9999"
                  className={style.input}
                />
              </div>
            </div>

            <div className={style.row}>
              <div className={style.formGroup}>
                <label className={style.label}>CPF</label>
                <input
                  name="cpf"
                  type="text"
                  defaultValue={customer.cpf || ""}
                  placeholder="000.000.000-00"
                  className={style.input}
                />
              </div>
              <div className={style.formGroup}>
                <label className={style.label}>CEP</label>
                <input
                  name="zipCode"
                  type="text"
                  defaultValue={customer.zipCode || ""}
                  placeholder="00000-000"
                  className={style.input}
                />
              </div>
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>Endereço</label>
              <input
                name="address"
                type="text"
                defaultValue={customer.address || ""}
                placeholder="Rua, número, bairro"
                className={style.input}
              />
            </div>

            <div className={style.row}>
              <div className={style.formGroup}>
                <label className={style.label}>Cidade</label>
                <input
                  name="city"
                  type="text"
                  defaultValue={customer.city || ""}
                  placeholder="Cidade"
                  className={style.input}
                />
              </div>
              <div className={style.formGroup}>
                <label className={style.label}>Estado</label>
                <input
                  name="state"
                  type="text"
                  defaultValue={customer.state || ""}
                  placeholder="SP"
                  maxLength={2}
                  className={style.input}
                />
              </div>
            </div>

            <div className={style.formFooter}>
              <button type="submit" className={style.submitButton}>
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
