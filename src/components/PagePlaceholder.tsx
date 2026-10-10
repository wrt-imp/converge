import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Container from './Container';
import styles from './PagePlaceholder.module.css';

interface PagePlaceholderProps {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
}

export default function PagePlaceholder({
  title,
  description,
  eyebrow,
  children,
}: PagePlaceholderProps): ReactNode {
  return (
    <Layout title={title} description={description}>
      <main className={styles.page}>
        <Container>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h1>{title}</h1>
          {children}
        </Container>
      </main>
    </Layout>
  );
}
