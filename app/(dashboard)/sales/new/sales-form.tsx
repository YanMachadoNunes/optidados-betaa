"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSale } from "../../customers/actions"; // Ajuste o caminho se necessário
import style from "./page.module.css";

// Tipos para o TypeScript não reclamar
type Product = {
  id: string;
  name: string;
  price: number; // Convertemos Decimal para number no Server Component
  stock: number;
};

type Customer = {
  id: string;
  name: string;
  cpf: string | null;
};

type CartItem = Product & {
  quantity: number;
};

interface SalesFormProps {
  products: Product[];
  customers: Customer[];
}

export default function SalesForm({ products, customers }: SalesFormProps) {
  const router = useRouter();

  // Estados do Sistema
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("anonymous");
  const [loading, setLoading] = useState(false);

  // Lógica: Filtrar produtos na busca
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Lógica: Adicionar ao Carrinho
  function addToCart(product: Product) {
    if (product.stock <= 0) return alert("Produto sem estoque!");

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        // Se já existe, só aumenta a quantidade (se tiver estoque)
        if (existing.quantity >= product.stock) {
          alert("Estoque máximo atingido para este item.");
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      // Se não existe, adiciona novo
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  // Lógica: Mudar quantidade (+ ou -)
  function updateQuantity(id: string, delta: number) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item; // Não deixa zerar por aqui (tem botão remover)
          if (newQty > item.stock) {
            alert("Estoque insuficiente.");
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  }

  // Lógica: Remover do Carrinho
  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  // Cálculo do Total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Lógica: Finalizar Venda (O momento da verdade)
  async function handleCheckout() {
    if (cart.length === 0) return alert("Carrinho vazio!");

    const confirm = window.confirm(
      `Finalizar venda de R$ ${total.toFixed(2)}?`,
    );
    if (!confirm) return;

    setLoading(true);

    // Formata para o formato que a Server Action espera
    const payloadItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    try {
      const result = await createSale(selectedCustomer, payloadItems);

      if (result.error) {
        alert("Erro: " + result.error);
      } else {
        alert("Venda realizada com sucesso!");
        router.push("/sales"); // Redireciona para lista de vendas
      }
    } catch (e) {
      alert("Erro inesperado ao processar venda.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={style.container}>
      {/* ESQUERDA: Área de Produtos */}
      <div className={style.productsArea}>
        {/* Busca */}
        <div className={style.searchCard}>
          <input
            type="text"
            placeholder="🔍 Buscar produto por nome..."
            className={style.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid de Produtos */}
        <div className={style.resultsGrid}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={style.productCard}
              onClick={() => addToCart(product)}
              style={{ opacity: product.stock === 0 ? 0.5 : 1 }}
            >
              <div>
                <div className={style.productName}>{product.name}</div>
                <div className={style.stockBadge}>Estoque: {product.stock}</div>
              </div>
              <div className={style.productMeta}>
                <span className={style.price}>
                  R$ {product.price.toFixed(2)}
                </span>
                <span style={{ fontSize: "1.2rem", color: "#3b82f6" }}>+</span>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p
              style={{
                color: "#64748b",
                textAlign: "center",
                gridColumn: "1/-1",
              }}
            >
              Nenhum produto encontrado.
            </p>
          )}
        </div>
      </div>

      {/* DIREITA: Carrinho (PDV) */}
      <div className={style.cartArea}>
        <div className={style.cartCard}>
          <div className={style.cartHeader}>
            <div className={style.cartTitle}>🛒 Caixa Aberto</div>
          </div>

          {/* Seleção de Cliente */}
          <div style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9" }}>
            <label
              style={{
                fontSize: "0.8rem",
                color: "#64748b",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Cliente Vinculado
            </label>
            <select
              className={style.searchInput} // Reutilizando estilo
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              style={{ padding: "0.5rem" }}
            >
              <option value="anonymous">Venda Avulsa (Sem cadastro)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.cpf ? `(${c.cpf})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de Itens */}
          <div className={style.cartBody}>
            {cart.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#cbd5e1",
                }}
              >
                O carrinho está vazio.
                <br />
                Clique nos produtos ao lado.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className={style.cartItem}>
                  <div className={style.itemInfo}>
                    <span className={style.itemName}>{item.name}</span>
                    <span className={style.itemPrice}>
                      {item.quantity}x R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className={style.itemActions}>
                    <button
                      className={style.qtyBtn}
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className={style.qtyBtn}
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                    <button
                      className={style.qtyBtn}
                      style={{
                        color: "red",
                        borderColor: "#fee2e2",
                        marginLeft: "0.5rem",
                      }}
                      onClick={() => removeFromCart(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer e Total */}
          <div className={style.cartFooter}>
            <div className={style.totalRow}>
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <button
              className={style.checkoutButton}
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
            >
              {loading ? "Processando..." : "Finalizar Venda"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
