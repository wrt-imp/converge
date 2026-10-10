import type {ReactNode} from 'react';

type StepCardProps = {
  number: string;
  title: string;
  children: ReactNode;
};

export function StepCard({number, title, children}: StepCardProps): ReactNode {
  return (
    <div className="doc-step-card">
      <div className="doc-step-number" aria-hidden="true">{number}</div>
      <div>
        <h3>{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
}

type InfoBoxProps = {
  tone?: 'tip' | 'note' | 'warning';
  title: string;
  children: ReactNode;
};

export function InfoBox({tone = 'note', title, children}: InfoBoxProps): ReactNode {
  return (
    <aside className={`doc-info-box doc-info-box--${tone}`}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}

type FlowProps = {
  steps: string[];
  caption?: string;
};

export function Flow({steps, caption}: FlowProps): ReactNode {
  return (
    <figure className="doc-flow">
      <div className="doc-flow-track">
        {steps.map((step, index) => (
          <div className="doc-flow-step" key={step}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

