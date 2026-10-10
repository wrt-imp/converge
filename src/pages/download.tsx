import type {ReactNode} from 'react';
import PagePlaceholder from '../components/PagePlaceholder';

export default function Download(): ReactNode {
  return (
    <PagePlaceholder
      title="下载"
      description="获取 Converge 客户端。"
      eyebrow="Download"
    />
  );
}
