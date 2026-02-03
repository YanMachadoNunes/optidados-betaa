import Link from "next/link";
import { createProduct } from "../../customers/actions"; // Ajuste o caminho se necessário
import style from "./page.module.css";

export default function NewProductPage() {
  return (
    <div className={style.pageWrapper}>
      <div className={style.container}>
        {/* Cabeçalho */}
        <div className={style.header}>
          <Link href="/inventory" className={style.backLink}>
            ← Voltar para Estoque
          </Link>
          <h1 className={style.title}>Novo Produto</h1>
        </div>

        {/* Formulário */}
        <div className={style.card}>
          <form action={createProduct} className={style.form}>
            {/* Linha 1: Identificação */}
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
                  list="categories" // Sugestão simples
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

            {/* Linha 2: Valores Financeiros */}
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

            {/* Botão Salvar */}
            <div className={style.footer}>
              <button type="submit" className={style.submitButton}>
                Cadastrar Produto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
