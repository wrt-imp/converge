import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import {
  Button,
  Card,
  Container,
  CTA,
  Diagram,
  FeatureCard,
  Section,
} from '../components';
import CognitiveModelFigure from '../components/CognitiveModelFigure';
import styles from './index.module.css';

const loopSteps = [
  {name: '识别', detail: '学习目标'},
  {name: '评估', detail: '回答证据'},
  {name: '诊断', detail: '卡点原因'},
  {name: '干预', detail: '教学动作'},
  {name: '验证', detail: '迁移表现'},
  {name: '更新', detail: '认知状态'},
] as const;

const loopStepClass = [
  styles.loopStepOne,
  styles.loopStepTwo,
  styles.loopStepThree,
  styles.loopStepFour,
  styles.loopStepFive,
  styles.loopStepSix,
];

type CapabilityIconName = 'state' | 'socratic' | 'knowledge' | 'memory' | 'skills' | 'agents';

function CapabilityIcon({name}: {name: CapabilityIconName}): ReactNode {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (name === 'state') {
    return <svg {...common}><circle cx="6" cy="7" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="14" cy="18" r="2"/><path d="m8 7 8-1M7 9l6 7m4-8-2 8"/></svg>;
  }
  if (name === 'socratic') {
    return <svg {...common}><path d="M5 5h14v10H9l-4 4V5Z"/><path d="M9 9h6m-6 3h3"/></svg>;
  }
  if (name === 'knowledge') {
    return <svg {...common}><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v17h4.5A3.5 3.5 0 0 1 20 22V5.5Z"/></svg>;
  }
  if (name === 'memory') {
    return <svg {...common}><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>;
  }
  if (name === 'skills') {
    return <svg {...common}><path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5V3Z"/><path d="M9 12h6m-3-3v6"/></svg>;
  }
  return <svg {...common}><circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="12" cy="17" r="3"/><path d="m9 9 2 5m4-5-2 5M10 7h4"/></svg>;
}

function CognitiveStateVisual(): ReactNode {
  return (
    <div className={styles.statePanel} role="img" aria-label="递归知识点的教学认知状态关系图">
      <div className={styles.statePanelHeader}>
        <div>
          <span className={styles.statePanelKicker}>Learner state</span>
          <strong>递归 · 认知状态</strong>
        </div>
        <span className={styles.stateStatus}><span />正在形成</span>
      </div>
      <div className={styles.stateCanvas}>
        <svg className={styles.stateEdges} viewBox="0 0 600 410" aria-hidden="true">
          <path d="M300 92 C220 120 165 148 126 204" />
          <path d="M300 92 C380 120 435 148 474 204" />
          <path d="M126 234 C180 286 222 306 300 318" />
          <path d="M474 234 C420 286 378 306 300 318" />
          <path className={styles.stateEdgeActive} d="M126 204 C210 188 360 188 474 204" />
        </svg>
        <div className={clsx(styles.stateNode, styles.stateNodeTopic)}>
          <span>主题</span><strong>递归</strong>
        </div>
        <div className={clsx(styles.stateNode, styles.stateNodeKnown)}>
          <span>已掌握</span><strong>自调用</strong>
        </div>
        <div className={clsx(styles.stateNode, styles.stateNodeGap)}>
          <span>知识缺口</span><strong>终止条件</strong>
        </div>
        <div className={clsx(styles.stateNode, styles.stateNodeAction)}>
          <span>下一步</span><strong>调用栈追问</strong>
        </div>
        <div className={styles.stateEvidence}>
          <span>证据</span>
          <strong>连续两次无法说明 base case</strong>
          <div><i /><em>置信度 0.82</em></div>
        </div>
      </div>
      <div className={styles.statePanelFooter}>
        <span>状态随学习行为更新</span>
        <span>Evidence-first</span>
      </div>
    </div>
  );
}

function CognitiveLoop(): ReactNode {
  return (
    <div className={styles.loopVisual}>
      <svg className={styles.loopTrack} viewBox="0 0 620 620" aria-hidden="true">
        <circle cx="310" cy="310" r="220" />
        <circle className={styles.loopPulse} cx="310" cy="310" r="220" />
      </svg>
      <div className={styles.loopCenter}>
        <span>学习证据</span>
        <strong>持续更新</strong>
        <small>每轮对话都是一次观测</small>
      </div>
      {loopSteps.map((step, index) => (
        <div key={step.name} className={clsx(styles.loopStep, loopStepClass[index])}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{step.name}</strong>
          <small>{step.detail}</small>
        </div>
      ))}
    </div>
  );
}

function ArchitectureFlow(): ReactNode {
  return (
    <div className={styles.architectureFlow}>
      <div className={clsx(styles.architectureNode, styles.architectureEntry)}>
        <span>01</span><strong>用户</strong><small>学习问题与行为</small>
      </div>
      <span className={styles.architectureArrow}>↓</span>
      <div className={clsx(styles.architectureNode, styles.architectureAgent)}>
        <span>02</span><strong>Agent</strong><small>识别目标 · 评估回答</small>
      </div>
      <span className={styles.architectureArrow}>↓</span>
      <div className={styles.architectureKnowledge}>
        <div><span>03A</span><strong>Memory</strong></div>
        <div><span>03B</span><strong>RAG</strong></div>
        <div><span>03C</span><strong>Skills</strong></div>
      </div>
      <span className={styles.architectureArrow}>↓</span>
      <div className={clsx(styles.architectureNode, styles.architectureMulti)}>
        <span>04</span><strong>Multi-Agent</strong><small>分工 · 协作 · 结果合并</small>
      </div>
      <span className={styles.architectureArrow}>↓</span>
      <div className={clsx(styles.architectureNode, styles.architectureTools)}>
        <span>05</span><strong>Tools</strong><small>MCP · 知识库 · 工作区</small>
      </div>
      <span className={styles.architectureArrow}>↓</span>
      <div className={clsx(styles.architectureNode, styles.architectureResult)}>
        <span>06</span><strong>结果</strong><small>教学动作与状态更新</small>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="教学认知状态引擎"
      description="Converge 持续理解学习者会什么、不会什么、误解什么，以及下一步应该怎样教。"
    >
      <main className={styles.home}>
        <section className={styles.hero} aria-labelledby="home-hero-title">
          <Container size="wide" className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>面向编程教育的教学认知状态引擎</p>
              <h1 id="home-hero-title">持续理解学生现在会什么，以及为什么会卡住。</h1>
              <p className={styles.heroLead}>
                Converge 将对话、知识检索、长期记忆和多 Agent 协作连接成可观察、可判断、可复盘的学习闭环。
              </p>
              <div className={styles.heroActions}>
                <Button to="/docs" size="large">阅读快速开始</Button>
                <Button to="/product" size="large" variant="secondary">了解产品</Button>
              </div>
              <div className={styles.heroMeta} aria-label="产品形态">
                <span>Desktop</span><i />
                <span>Wiki</span><i />
                <span>Skills</span><i />
                <span>Multi-Agent</span>
              </div>
            </div>
            <CognitiveStateVisual />
          </Container>
        </section>

        <Section
          id="positioning"
          eyebrow="Product position"
          title="不是保存聊天记录，而是理解学习状态。"
          intro="Converge 关注知识点、错误证据和下一步教学动作之间的关系。"
        >
          <div className={styles.positioningGrid}>
            <Card variant="plain" padding="small" className={styles.positioningItem}>
              <span>01</span><strong>观察</strong><p>从回答、追问与练习中收集学习证据。</p>
            </Card>
            <Card variant="plain" padding="small" className={styles.positioningItem}>
              <span>02</span><strong>判断</strong><p>识别掌握度、知识缺口与可能的误解。</p>
            </Card>
            <Card variant="plain" padding="small" className={styles.positioningItem}>
              <span>03</span><strong>干预</strong><p>选择追问、提示、反例、练习或直接讲解。</p>
            </Card>
          </div>
          <div className={styles.positioningShift}>
            <div><span>普通对话记忆</span><strong>“学生说过什么”</strong></div>
            <span className={styles.shiftArrow}>→</span>
            <div className={styles.shiftTarget}><span>教学认知状态</span><strong>“学生现在理解到哪里”</strong></div>
          </div>
        </Section>

        <Section
          id="cognitive-model"
          tone="ruled"
          eyebrow="Mechanism model"
          title="知识网络 × 教学认知状态"
          intro="知识网络描述知识点及其关系；学习者状态描述学生在这张网络中的位置。"
        >
          <CognitiveModelFigure />
        </Section>

        <Section
          id="learning-loop"
          tone="subtle"
          eyebrow="Teaching loop"
          title="一次教学，不止一次回答。"
          intro="认知状态随着新证据持续变化，并直接影响下一步教学动作。"
          align="center"
        >
          <CognitiveLoop />
        </Section>

        <Section
          id="capabilities"
          eyebrow="Capabilities"
          title="围绕学习过程组织能力"
          intro="每个模块解决一个清晰问题，并共同服务于持续学习闭环。"
        >
          <div className={styles.capabilityGrid}>
            <FeatureCard icon={<CapabilityIcon name="state" />} title="认知状态" description="维护掌握度、误解、阻塞点与证据来源。" />
            <FeatureCard icon={<CapabilityIcon name="socratic" />} title="苏格拉底式教学" description="根据回答质量调整问题、提示和难度台阶。" />
            <FeatureCard icon={<CapabilityIcon name="knowledge" />} title="RAG 与 Wiki" description="定位知识点、前置关系和可靠参考内容。" />
            <FeatureCard icon={<CapabilityIcon name="memory" />} title="长期记忆" description="保留偏好、目标、约束与可审核的学习信息。" />
            <FeatureCard icon={<CapabilityIcon name="skills" />} title="教学 Skills" description="把教学策略沉淀为可加载、可版本化的能力。" />
            <FeatureCard icon={<CapabilityIcon name="agents" />} title="Multi-Agent" description="拆分复杂任务，协调执行并合并可靠结果。" />
          </div>
        </Section>

        <Section
          id="architecture"
          tone="ruled"
          eyebrow="Architecture"
          title="清晰的软件边界，支撑持续教学"
          intro="从学习行为进入 Agent 编排，再由知识、记忆、工具与多 Agent 协同完成闭环。"
        >
          <Diagram
            title="Converge 系统工作流"
            description="主要能力按职责分层，教学状态贯穿每一次执行。"
            canvasClassName={styles.architectureCanvas}
            scrollable={false}
          >
            <ArchitectureFlow />
          </Diagram>
        </Section>

        <Section
          id="scenarios"
          eyebrow="Use cases"
          title="服务真实的教与学过程"
          intro="不替代学习者思考，也不替代教师判断。"
        >
          <div className={styles.scenarioGrid}>
            <Card className={styles.scenarioCard}>
              <span className={styles.scenarioIndex}>01</span>
              <h3>学生自主学习</h3>
              <p>从“不会”开始，通过追问、提示和迁移练习逐步形成理解。</p>
              <div className={styles.scenarioPath}><span>表达问题</span><i /><span>获得脚手架</span><i /><span>验证理解</span></div>
            </Card>
            <Card className={styles.scenarioCard}>
              <span className={styles.scenarioIndex}>02</span>
              <h3>教师教学设计</h3>
              <p>结合教学 Skills 与知识资料，组织课程、问题和分层练习。</p>
              <div className={styles.scenarioPath}><span>确定目标</span><i /><span>选择策略</span><i /><span>生成方案</span></div>
            </Card>
            <Card className={styles.scenarioCard}>
              <span className={styles.scenarioIndex}>03</span>
              <h3>持续学习复盘</h3>
              <p>让掌握度判断回到原始回答、错误模式和真实学习行为。</p>
              <div className={styles.scenarioPath}><span>汇集证据</span><i /><span>识别变化</span><i /><span>安排复习</span></div>
            </Card>
          </div>
        </Section>

        <Section
          id="product-preview"
          tone="subtle"
          eyebrow="Product preview"
          title="真实产品界面将在这里呈现"
          intro="当前仓库没有可用于官网的产品截图，因此保留一个清晰、可直接替换的截图位置。"
        >
          <div className={styles.screenshotPlaceholder} role="img" aria-label="Converge 真实产品截图占位区域">
            <div className={styles.screenshotPlaceholderBar}>
              <span>Converge Desktop</span>
              <span>真实截图待补充</span>
            </div>
            <div className={styles.screenshotPlaceholderBody}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <rect x="5" y="7" width="38" height="34" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 15h38M15 15v26" stroke="currentColor" strokeWidth="1.5"/>
                <path d="m21 30 5-5 4 4 4-3 7 7" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <strong>替换为真实桌面端产品截图</strong>
              <p>建议尺寸 1600 × 1000，放入 static/img/product/ 后替换本区块。</p>
            </div>
          </div>
        </Section>

        <CTA
          title="从软件手册开始了解 Converge"
          description="查看项目定位、安装方式与核心概念，建立第一个可持续的学习闭环。"
          actions={
            <>
              <Button to="/docs">阅读软件手册</Button>
              <Button to="/download" variant="secondary">查看下载</Button>
            </>
          }
        />
      </main>
    </Layout>
  );
}
