import { createCustomer } from "../actions";
import Link from "next/link";
import style from "./page.module.css";

export default function NewCustomerPage() {
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <div className={style.header}>
          <Link href="/customers" className={style.backLink}>
            ← Voltar para Lista
          </Link>
          <h1 className={style.title}>Cadastrar Novo Cliente</h1>
        </div>

        <div className={style.formCard}>
          <form action={createCustomer} className={style.formGrid}>
            <div className={style.formGroup}>
              <label className={style.label}>Nome Completo *</label>
              <input
                name="name"
                type="text"
                required
                className={style.input}
                placeholder="Ex: João Silva"
              />
            </div>

            <div className={style.row}>
              <div className={style.formGroup}>
                <label className={style.label}>E-mail</label>
                <input
                  name="email"
                  type="email"
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

            <div className={style.row}>
              <div className={style.formGroup}>
                <label className={style.label}>CPF</label>
                <input
                  name="cpf"
                  type="text"
                  className={style.input}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className={style.formGroup}>
                <label className={style.label}>CEP</label>
                <input
                  name="zipCode"
                  type="text"
                  className={style.input}
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>Endereço</label>
              <input
                name="address"
                type="text"
                className={style.input}
                placeholder="Rua, número, bairro"
              />
            </div>

            <div className={style.row}>
              <div className={style.formGroup}>
                <label className={style.label}>Cidade</label>
                <input
                  name="city"
                  type="text"
                  className={style.input}
                  placeholder="Cidade"
                />
              </div>
              <div className={style.formGroup}>
                <label className={style.label}>Estado</label>
                <input
                  name="state"
                  type="text"
                  className={style.input}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>

            <button type="submit" className={style.submitButton}>
              Salvar Cliente
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
