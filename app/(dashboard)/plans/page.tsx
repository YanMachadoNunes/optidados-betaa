import Link from "next/link";
import { Check, Crown, Zap, Shield } from "lucide-react";
import styles from "./page.module.css";

const plans = [
  {
    id: "beta",
    name: "Plano Beta",
    price: 129.90,
    period: "mês",
    description: "Acesso completo a todos os recursos",
    icon: Crown,
    popular: true,
    features: [
      "Gestão completa de clientes",
      "Controle de estoque",
      "Gestão de pedidos",
      "Vendas e orçamento",
      "Financeiro completo",
      "Receitas médicas",
      "Suporte prioritário",
      "Atualizações gratuitas",
    ],
  },
];

export default function PlansPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Planos</h1>
        <p className={styles.subtitle}>
          Escolha o plano ideal para sua ótica
        </p>
      </div>

      <div className={styles.plansGrid}>
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div 
              key={plan.id} 
              className={`${styles.planCard} ${plan.popular ? styles.popular : ""}`}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>Mais Popular</div>
              )}
              <div className={styles.planIcon}>
                <Icon size={32} />
              </div>
              <h2 className={styles.planName}>{plan.name}</h2>
              <p className={styles.planDescription}>{plan.description}</p>
              
              <div className={styles.planPrice}>
                <span className={styles.currency}>R$</span>
                <span className={styles.amount}>{plan.price.toFixed(2)}</span>
                <span className={styles.period}>/{plan.period}</span>
              </div>

              <ul className={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <li key={index} className={styles.featureItem}>
                    <Check size={18} className={styles.checkIcon} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={`/plans/${plan.id}/checkout`} className={styles.subscribeButton}>
                Assinar Agora
              </Link>
            </div>
          );
        })}
      </div>

      <div className={styles.trustBadges}>
        <div className={styles.badge}>
          <Shield size={24} />
          <span>Pagamento Seguro</span>
        </div>
        <div className={styles.badge}>
          <Zap size={24} />
          <span>Ativação Imediata</span>
        </div>
      </div>
    </div>
  );
}
