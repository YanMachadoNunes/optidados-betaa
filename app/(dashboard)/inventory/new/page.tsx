import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { createProduct } from "../../customers/actions";
import style from "./page.module.css";

export default function NewProductPage() {
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        <div className={style.header}>
          <Link href="/inventory" className={style.backLink}>
            <ArrowLeft size={18} />
            Voltar para Estoque
          </Link>
          <h1 className={style.title}>Novo Produto</h1>
        </div>

        <div className={style.card}>
          <form action={createProduct} className={style.form}>
            <div className={style.row}>
              <div className={style.field}>
                <label className={style.label}>Nome do Produto</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Ex: Lente Multifocal Premium"
                  required
                  className={style.input}
                />
              </div>
              <div className={style.field}>
                <label className={style.label}>Categoria</label>
                <input
                  name="category"
                  type="text"
                  placeholder="Ex: Lentes, Armações..."
                  required
                  list="categories"
                  className={style.input}
                />
                <datalist id="categories">
                  <option value="Lentes de Contato" />
                  <option value="Armações" />
                  <option value="Lentes Oftálmicas" />
                  <option value="Acessórios" />
                </datalist>
              </div>
            </div>

            <div className={style.row}>
              <div className={style.field}>
                <label className={style.label}>Preço de Custo (R$)</label>
                <input
                  name="costPrice"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  required
                  className={style.input}
                />
              </div>
              <div className={style.field}>
                <label className={style.label}>Preço de Venda (R$)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  required
                  className={style.input}
                />
              </div>
              <div className={style.field}>
                <label className={style.label}>Estoque Inicial</label>
                <input
                  name="stock"
                  type="number"
                  placeholder="0"
                  required
                  className={style.input}
                />
              </div>
            </div>

            <div className={style.field}>
              <label className={style.label}>Código do Laboratório (opcional)</label>
              <input
                name="labCode"
                type="text"
                placeholder="Ex: LAB-2024-001234"
                className={style.input}
              />
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                Código de rastreamento do laboratório para lentes
              </small>
            </div>

            <div className={style.footer}>
              <button type="submit" className={style.submitButton}>
                <Package size={18} />
                Cadastrar Produto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
