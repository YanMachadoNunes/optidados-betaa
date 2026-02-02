import { prisma } from "../../../../lib/prisma";
import { updateCustomer } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import style from "./page.module.css";

// 1. Definição da tipagem para os parâmetros dinâmicos (Next.js 15+)
interface Props {
  params: Promise<{
    id: string;
  }>;
}

/**
 * EditCustomerPage - Refatorada para estabilidade no Turbopack
 * O uso de async na exportação padrão é o padrão para Server Components.
 */
export default async function Page({ params }: Props) {
  // 2. Desembrulha a Promise dos parâmetros (Obrigatório nas versões recentes)
  const { id } = await params;

  // 3. Busca os dados no Banco de Dados (Prisma)
  const customer = await prisma.customer.findUnique({
    where: { id: id },
  });

  // 4. Caso o ID seja inválido ou não exista, dispara o 404 do Next
  if (!customer) {
    notFound();
  }

  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        {/* Cabeçalho de Navegação */}
        <div className={style.header}>
          <Link href="/customers" className={style.backLink}>
            <span>←</span> Cancelar e Voltar
          </Link>
          <h1 className={style.title}>Editar Cliente</h1>
        </div>

        {/* Card do Formulário (Dossiê de Edição) */}
        <div className={style.formCard}>
          {/* A Server Action 'updateCustomer' processa os dados diretamente */}
          <form action={updateCustomer} className={style.formGrid}>
            {/* Input Oculto: Essencial para a Server Action saber quem atualizar */}
            <input type="hidden" name="id" value={customer.id} />

            {/* Campo: Nome */}
            <div className={style.formGroup}>
              <label className={style.label}>Nome Completo</label>
              <input
                name="name"
                type="text"
                defaultValue={customer.name}
                required
                placeholder="Ex: Yan Maestro"
                className={style.input}
              />
            </div>

            {/* Linha Dupla: Email e Telefone */}
            <div className={style.row}>
              <div className={style.formGroup}>
                <label className={style.label}>E-mail institucional</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={customer.email ?? ""}
                  required
                  placeholder="yan@empresa.com"
                  className={style.input}
                />
              </div>

              <div className={style.formGroup}>
                <label className={style.label}>Telefone / WhatsApp</label>
                <input
                  name="phone"
                  type="text"
                  defaultValue={customer.phone || ""}
                  placeholder="+55 (00) 00000-0000"
                  className={style.input}
                />
              </div>
            </div>

            {/* Campo: CPF / Documentação */}
            <div className={style.formGroup}>
              <label className={style.label}>CPF ou Identificação</label>
              <input
                name="cpf"
                type="text"
                defaultValue={customer.cpf || ""}
                placeholder="000.000.000-00"
                className={style.input}
              />
            </div>

            {/* Botão de Ação Principal */}
            <div className={style.formFooter}>
              <button type="submit" className={style.submitButton}>
                Salvar Alterações no Dossiê
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
