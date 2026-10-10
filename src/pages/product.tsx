import type {ReactNode} from 'react';
import PagePlaceholder from '../components/PagePlaceholder';

export default function Product(): ReactNode {
  return (
    <PagePlaceholder
      title="产品"
      description="Converge 产品信息。"
      eyebrow="Product"
    />
  );
}
