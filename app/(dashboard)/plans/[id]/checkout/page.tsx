"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Landmark, 
  Check, 
  Shield, 
  Lock,
  Copy,
  CheckCircle,
  QrCode,
  Loader2
} from "lucide-react";
import styles from "./page.module.css";

export default function CheckoutPage() {
  const params = useParams();
  const planId = params?.id as string;
  
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "boleto">("pix");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
  const [copied, setCopied] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    installments: "1",
  });
  const [pixData, setPixData] = useState<{
    qrCode?: string;
    qrCodeBase64?: string;
    paymentId?: number;
  } | null>(null);

  const planPrice = 1.00;

  const pixCode = "00020126560014br.gov.bcb.pix0136a634e-5f5e-4a2b-8c1a-12345678901234520012https://optigestao.com/pix5303987";

  const handleCopyPix = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePayment = async () => {
    setPaymentStatus("processing");
    
    try {
      if (paymentMethod === "pix") {
        const response = await fetch("/api/create-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planName: "Beta",
            price: planPrice,
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setPixData({
            qrCode: data.qrCode,
            qrCodeBase64: data.qrCodeBase64,
            paymentId: data.preferenceId,
          });
          
          // Se tem link de pagamento, abre em nova aba
          if (data.paymentUrl) {
            window.open(data.paymentUrl, '_blank');
          }
        } else {
          alert("Erro ao gerar PIX: " + data.error);
          setPaymentStatus("idle");
          return;
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPaymentStatus("success");
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("idle");
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <Check size={48} />
          </div>
          <h2>Pagamento Realizado!</h2>
          <p>
            {paymentMethod === "pix" 
              ? "Seu pagamento via PIX foi aprovado!" 
              : "Seu pagamento com cartão foi aprovado!"}
          </p>
          <p className={styles.successEmail}>
            Enviamos um email de confirmação para você.
          </p>
          <Link href="/orders" className={styles.successButton}>
            Começar a Usar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/plans" className={styles.backLink}>
        <ArrowLeft size={20} />
        Voltar aos planos
      </Link>

      <div className={styles.checkoutGrid}>
        <div className={styles.orderSummary}>
          <h2>Resumo do Pedido</h2>
          
          <div className={styles.planInfo}>
            <div className={styles.planIcon}>
              <CreditCard size={24} />
            </div>
            <div>
              <h3>Plano Beta</h3>
              <p>Acesso completo ao sistema</p>
            </div>
          </div>

          <div className={styles.priceRow}>
            <span>Plano Mensal</span>
            <span>R$ {planPrice.toFixed(2)}</span>
          </div>
          
          <div className={styles.priceRow}>
            <span>Total hoje</span>
            <span className={styles.totalPrice}>R$ {planPrice.toFixed(2)}</span>
          </div>

          <div className={styles.securityInfo}>
            <Lock size={16} />
            <span>Pagamento 100% seguro</span>
          </div>
        </div>

        <div className={styles.paymentSection}>
          <h2>Forma de Pagamento</h2>
          
          <div className={styles.paymentMethods}>
            <button
              type="button"
              className={`${styles.paymentMethod} ${paymentMethod === "pix" ? styles.active : ""}`}
              onClick={() => setPaymentMethod("pix")}
            >
              <Smartphone size={24} />
              <div>
                <span className={styles.methodTitle}>PIX</span>
                <span className={styles.methodSubtitle}>Aprovação imediata</span>
              </div>
              {paymentMethod === "pix" && <Check size={20} className={styles.checkIcon} />}
            </button>

            <button
              type="button"
              className={`${styles.paymentMethod} ${paymentMethod === "card" ? styles.active : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <CreditCard size={24} />
              <div>
                <span className={styles.methodTitle}>Cartão de Crédito</span>
                <span className={styles.methodSubtitle}>Parcele em até 12x</span>
              </div>
              {paymentMethod === "card" && <Check size={20} className={styles.checkIcon} />}
            </button>

            <button
              type="button"
              className={`${styles.paymentMethod} ${paymentMethod === "boleto" ? styles.active : ""}`}
              onClick={() => setPaymentMethod("boleto")}
            >
              <Landmark size={24} />
              <div>
                <span className={styles.methodTitle}>Boleto Bancário</span>
                <span className={styles.methodSubtitle}>Vencimento em 3 dias</span>
              </div>
              {paymentMethod === "boleto" && <Check size={20} className={styles.checkIcon} />}
            </button>
          </div>

          {paymentMethod === "pix" && (
            <div className={styles.pixSection}>
              <h3>Pagamento via PIX</h3>
              <p className={styles.pixInstructions}>
                Escaneie o QR Code ou copie o código abaixo:
              </p>
              
              <div className={styles.qrCodeContainer}>
                <div className={styles.qrCode}>
                  {pixData?.qrCodeBase64 ? (
                    <img 
                      src={`data:image/png;base64,${pixData.qrCodeBase64}`} 
                      alt="QR Code PIX" 
                      width={160} 
                      height={160}
                    />
                  ) : (
                    <>
                      <QrCode size={160} />
                      <span className={styles.qrPlaceholder}>QR Code PIX</span>
                    </>
                  )}
                </div>
              </div>

              {pixData?.qrCode && (
                <div className={styles.pixCodeContainer}>
                  <label>Código PIX Copia e Cola</label>
                  <div className={styles.pixCodeBox}>
                    <code>{pixData.qrCode.slice(0, 50)}...</code>
                    <button onClick={handleCopyPix} className={styles.copyButton}>
                      {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                      {copied ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
              )}

              <button 
                className={styles.payButton}
                onClick={handlePayment}
                disabled={paymentStatus === "processing" || !!pixData?.paymentId}
              >
                {paymentStatus === "processing" ? (
                  <>
                    <Loader2 size={20} className={styles.spinner} />
                    Gerando PIX...
                  </>
                ) : pixData?.paymentId ? (
                  <>
                    <Check size={20} />
                    PIX Gerado!
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Gerar PIX de R$ {planPrice.toFixed(2)}
                  </>
                )}
              </button>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className={styles.cardForm}>
              <h3>Dados do Cartão</h3>
              
              <div className={styles.formGroup}>
                <label>Número do cartão</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000"
                  value={cardForm.number}
                  onChange={(e) => setCardForm({...cardForm, number: e.target.value})}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Nome completo</label>
                <input 
                  type="text" 
                  placeholder="Como está no cartão"
                  value={cardForm.name}
                  onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Validade</label>
                  <input 
                    type="text" 
                    placeholder="MM/AA"
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({...cardForm, expiry: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CVV</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({...cardForm, cvv: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Parcelas</label>
                <select 
                  value={cardForm.installments}
                  onChange={(e) => setCardForm({...cardForm, installments: e.target.value})}
                >
                  <option value="1">1x de R$ {planPrice.toFixed(2)} (sem juros)</option>
                </select>
              </div>

              <button 
                className={styles.payButton}
                onClick={handlePayment}
                disabled={paymentStatus === "processing"}
              >
                {paymentStatus === "processing" ? (
                  <>
                    <Loader2 size={20} className={styles.spinner} />
                    Processando...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    Pagar R$ {planPrice.toFixed(2)}
                  </>
                )}
              </button>
            </div>
          )}

          {paymentMethod === "boleto" && (
            <div className={styles.boletoSection}>
              <h3>Boleto Bancário</h3>
              <p className={styles.boletoInstructions}>
                O boleto será enviado para seu email após a confirmação.
                Vencimento em 3 dias úteis.
              </p>

              <div className={styles.boletoInfo}>
                <div className={styles.boletoRow}>
                  <span>Valor:</span>
                  <strong>R$ {planPrice.toFixed(2)}</strong>
                </div>
                <div className={styles.boletoRow}>
                  <span>Vencimento:</span>
                  <strong>
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                  </strong>
                </div>
              </div>

              <button 
                className={styles.payButton}
                onClick={handlePayment}
                disabled={paymentStatus === "processing"}
              >
                {paymentStatus === "processing" ? (
                  <>
                    <Loader2 size={20} className={styles.spinner} />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Landmark size={20} />
                    Gerar Boleto
                  </>
                )}
              </button>
            </div>
          )}

          <p className={styles.terms}>
            Ao clicar em "Pagar", você concorda com os Termos de Uso e Política de Privacidade.
          </p>

          <div className={styles.mercadoPagoInfo}>
            <Shield size={20} />
            <span>Seus dados estão protegidos com criptografia SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
