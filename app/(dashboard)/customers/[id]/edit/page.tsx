import { prisma } from "../../../../lib/prisma"; // Caminho relativo mantido
import { updateCustomer } from "../../actions"; // Caminho relativo mantido
import Link from "next/link";
import { notFound } from "next/navigation";
import style from "./page.module.css"; // AQUI: Importando o estilo do Império

// 1. Definição da Promise para params (Next.js 15)
interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCustomerPage({ params }: Props) {
  // 2. Aguarda o ID chegar
  const { id } = await params;

  // 3. Busca os dados atuais
  const customer = await prisma.customer.findUnique({
    where: { id: id },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        {/* Cabeçalho */}
        <div className={style.header}>
          {/* Botão Cancelar voltando para a Lista Geral */}
          <Link href="/customers" className={style.backLink}>
            <span>←</span> Cancelar e Voltar
          </Link>
          <h1 className={style.title}>Editar Cliente</h1>
        </div>

        {/* Card do Formulário (Fundo Branco Flutuante) */}
        <div className={style.formCard}>
          <form action={updateCustomer} className={style.formGrid}>
            {/* Input Oculto Vital */}
            <input type="hidden" name="id" value={customer.id} />

            {/* Nome */}
            <div className={style.formGroup}>
              <label className={style.label}>Nome Completo</label>
              <input
                name="name"
                type="text"
                defaultValue={customer.name}
                required
                className={style.input}
              />
            </div>

            {/* Linha Dupla: Email e Telefone */}
            <div className={style.row}>
              <div className={style.formGroup}>
                <label className={style.label}>E-mail</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={customer.email}
                  required
                  className={style.input}
                />
              </div>
              <div className={style.formGroup}>
                <label className={style.label}>Telefone</label>
                <input
                  name="phone"
                  type="text"
                  defaultValue={customer.phone || ""}
                  className={style.input}
                />
              </div>
            </div>

            {/* CPF */}
            <div className={style.formGroup}>
              <label className={style.label}>CPF</label>
              <input
                name="cpf"
                type="text"
                defaultValue={customer.cpf || ""}
                className={style.input}
              />
            </div>

            {/* Botão de Salvar */}
            <button type="submit" className={style.submitButton}>
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
