import { createCustomer } from "../actions";
import Link from "next/link";
import style from "./page.module.css"; // Importando o estilo local corretamente

export default function NewCustomerPage() {
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        {/* Cabeçalho */}
        <div className={style.header}>
          <Link href="/customers" className={style.backLink}>
            <span>←</span> Voltar para Lista
          </Link>
          <h1 className={style.title}>Cadastrar Novo Cliente</h1>
        </div>

        {/* O Card Branco Flutuante (Formulário do Império) */}
        <div className={style.formCard}>
          <form action={createCustomer} className={style.formGrid}>
            {/* Campo Nome */}
            <div className={style.formGroup}>
              <label className={style.label}>Nome Completo</label>
              <input
                name="name"
                type="text"
                required
                className={style.input}
                placeholder="Ex: João Silva"
              />
            </div>

            {/* Linha Dupla: Email e Telefone */}
            <div className={style.row}>
              <div className={style.formGroup}>
                <label className={style.label}>E-mail</label>
                <input
                  name="email"
                  type="email"
                  required
                  className={style.input}
                  placeholder="joao@email.com"
                />
              </div>
              <div className={style.formGroup}>
                <label className={style.label}>Telefone</label>
                <input
                  name="phone"
                  type="text"
                  className={style.input}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            {/* Campo CPF */}
            <div className={style.formGroup}>
              <label className={style.label}>CPF</label>
              <input
                name="cpf"
                type="text"
                className={style.input}
                placeholder="000.000.000-00"
              />
            </div>

            {/* Botão de Ação */}
            <button type="submit" className={style.submitButton}>
              Salvar Cliente
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
