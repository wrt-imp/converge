import type {ReactNode} from 'react';
import PagePlaceholder from '../components/PagePlaceholder';

export default function FAQ(): ReactNode {
  return (
    <PagePlaceholder
      title="常见问题"
      description="Converge 常见问题。"
      eyebrow="FAQ"
    />
  );
}
