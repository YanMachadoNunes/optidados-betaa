"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { createSale } from "../../customers/actions";
import style from "./page.module.css";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
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

const PRODUCTS_PER_PAGE = 10;

export default function SalesForm({ products, customers }: SalesFormProps) {
  const { user } = useAuth()
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("anonymous");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const visibleProducts = filteredProducts.slice(startIndex, endIndex);

  function handleSearch(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  function addToCart(product: Product) {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(id: string, delta: number) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return item;
          if (newQty > item.stock) return item;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  async function handleCheckout() {
    if (cart.length === 0) return alert("Carrinho vazio!");

    const confirm = window.confirm(
      `Finalizar venda de R$ ${total.toFixed(2)}?`
    );
    if (!confirm) return;

    setLoading(true);

    const payloadItems = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    try {
      if (!user?.id) {
        alert("Usuário não autenticado");
        return;
      }
      const result = await createSale(user.id, selectedCustomer, payloadItems);

      if (result.error) {
        alert("Erro: " + result.error);
      } else {
        alert("Venda realizada com sucesso!");
        router.push("/sales");
      }
    } catch (e) {
      alert("Erro inesperado ao processar venda.");
    } finally {
      setLoading(false);
    }
  }

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pageNumbers.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push('...');
    }
  }

  return (
    <div className={style.content}>
      {/* Lista de Produtos */}
      <div>
        <div className={style.searchCard}>
          <input
            type="text"
            placeholder="Buscar produto..."
            className={style.searchInput}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className={style.productsTable}>
          <div className={style.tableHeader}>
            <span>Produto</span>
            <span>Preço</span>
            <span>Estoque</span>
            <span></span>
            <span></span>
          </div>

          {visibleProducts.map((product) => (
            <div 
              key={product.id} 
              className={`${style.tableRow} ${product.stock === 0 ? style.outOfStock : ""}`}
            >
              <div>
                <div className={style.productName}>{product.name}</div>
                <div className={style.productCategory}>{product.category}</div>
              </div>
              <div className={style.price}>
                R$ {product.price.toFixed(2)}
              </div>
              <div className={`${style.stock} ${product.stock === 0 ? style.out : product.stock <= 5 ? style.low : ""}`}>
                {product.stock === 0 ? "Esgotado" : product.stock}
              </div>
              <div></div>
              <button
                className={style.addBtn}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                +
              </button>
            </div>
          ))}

          {visibleProducts.length === 0 && (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
              Nenhum produto encontrado.
            </div>
          )}

          {totalPages > 1 && (
            <div className={style.pagination}>
              <button
                className={style.pageBtn}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              {pageNumbers.map((num, idx) => (
                num === '...' ? (
                  <span key={`ellipsis-${idx}`} style={{ color: "var(--text-muted)" }}>...</span>
                ) : (
                  <button
                    key={num}
                    className={`${style.pageBtn} ${currentPage === num ? style.active : ""}`}
                    onClick={() => setCurrentPage(num as number)}
                  >
                    {num}
                  </button>
                )
              ))}
              <button
                className={style.pageBtn}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Carrinho */}
      <div className={style.cartArea}>
        <div className={style.cartCard}>
          <div className={style.cartHeader}>
            Caixa Aberto
          </div>

          <div className={style.customerSelect}>
            <label>Cliente</label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="anonymous">Venda Avulsa</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.cpf ? `(${c.cpf})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className={style.cartBody}>
            {cart.length === 0 ? (
              <div className={style.emptyCart}>
                <span>🛒</span>
                Carrinho vazio
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
                    <span style={{ minWidth: "20px", textAlign: "center", fontWeight: 600 }}>{item.quantity}</span>
                    <button
                      className={style.qtyBtn}
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>
                    <button
                      className={style.removeBtn}
                      onClick={() => removeFromCart(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={style.cartFooter}>
            <div className={style.totalRow}>
              <span>Total</span>
              <span className={style.totalValue}>R$ {total.toFixed(2)}</span>
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
