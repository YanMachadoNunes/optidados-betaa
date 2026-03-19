import styles from "./page.module.css"
import { Clock } from "lucide-react"

export default function PlansPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Clock size={64} />
        </div>
        <h1 className={styles.title}>Em Breve</h1>
        <p className={styles.description}>
          A versão paga do OptiGestão será implementada em breve!
        </p>
        <div className={styles.features}>
          <h2>O que vem por aí:</h2>
          <ul>
            <li>Gestão avançada de múltiplas lojas</li>
            <li>Relatórios detalhados e exportação</li>
            <li>Integração com sistemas contábeis</li>
            <li>App mobile para vendedores</li>
            <li>Backup automático na nuvem</li>
            <li>Suporte prioritário</li>
          </ul>
        </div>
        <p className={styles.note}>
          Continue usando a versão gratuita e aguarde novidades!
        </p>
      </div>
    </div>
  )
}
