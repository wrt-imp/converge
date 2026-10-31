import {createContext, useContext, useState, type ReactNode} from 'react';

export type LearningMode = 'question' | 'guided' | 'materials';
export interface LearningDraft {id: string; text: string; mode: LearningMode; resourceNames: string[]}
export interface LocalResource {id: string; name: string; size: number; text?: string; status: 'local' | 'needs-parser'}
interface WorkspaceState {
  drafts: LearningDraft[];
  resources: LocalResource[];
  addDraft: (draft: Omit<LearningDraft, 'id'>) => void;
  addResources: (resources: LocalResource[]) => void;
  removeResource: (id: string) => void;
}
const WorkspaceContext = createContext<WorkspaceState | null>(null);

/** Ephemeral browser state only: no network, cookies, storage, account, or fake answers. */
export function WorkspaceProvider({children}: {children: ReactNode}): ReactNode {
  const [drafts, setDrafts] = useState<LearningDraft[]>([]);
  const [resources, setResources] = useState<LocalResource[]>([]);
  return <WorkspaceContext.Provider value={{
    drafts, resources,
    addDraft: draft => setDrafts(current => [...current, {...draft, id: `draft-${Date.now()}-${current.length}`}]),
    addResources: items => setResources(current => [...current, ...items]),
    removeResource: id => setResources(current => current.filter(item => item.id !== id)),
  }}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace(): WorkspaceState {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('WorkspaceProvider is required');
  return context;
}
