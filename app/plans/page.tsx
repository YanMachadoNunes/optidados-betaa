import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import styles from "./page.module.css";

export default function PlansPage() {
  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={20} />
        Voltar ao Dashboard
      </Link>

      <div className={styles.header}>
        <div className={styles.icon}>
          <Clock size={32} />
        </div>
        <h1>Planos e Pagamentos</h1>
        <p className={styles.subtitle}>
          Em breve! A integração com Mercado Pago será implementada em breve.
        </p>
      </div>

      <div className={styles.infoCard}>
        <h2>Como implementar o Mercado Pago:</h2>
        <ol>
          <li>
            <strong>Criar conta no Mercado Pago</strong>
            <p>Acesse <a href="https://www.mercadopago.com.br" target="_blank">mercadopago.com.br</a> e crie sua conta de vendedor</p>
          </li>
          <li>
            <strong>Obter Access Token</strong>
            <p>No painel do desenvolvedor, vá em Credenciais e copie o Access Token</p>
          </li>
          <li>
            <strong>Configurar variáveis de ambiente</strong>
            <pre>MercadoPago_ACCESS_TOKEN=seu_token_aqui</pre>
          </li>
          <li>
            <strong>Criar API de pagamento</strong>
            <p>Use a rota <code>/api/create-payment</code> para criar preferências de pagamento</p>
          </li>
          <li>
            <strong>Configurar Webhook</strong>
            <p>Configure a URL de notificação para receber confirmações de pagamento</p>
          </li>
        </ol>
      </div>

      <Link href="/" className={styles.button}>
        Ir para o Dashboard
      </Link>
    </div>
  );
}
