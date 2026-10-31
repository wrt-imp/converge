import type {ReactNode} from 'react';
import {WorkspaceProvider} from '../components/WorkspaceProvider';

export default function Root({children}: {children: ReactNode}): ReactNode {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
