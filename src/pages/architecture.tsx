import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Button} from '../components';
import {PageHero, SectionHeading} from '../components/SitePrimitives';
import styles from './architecture.module.css';

const layers = [
  {id: '01', name: '体验层', english: 'EXPERIENCE', items: ['Desktop Workspace', '对话与学习任务', 'Wiki 工作区'], note: '学习者与教师发起任务、查看过程与结果。'},
  {id: '02', name: 'Agent 编排层', english: 'ORCHESTRATION', items: ['Task Orchestrator', 'Socratic Agent', 'Multi-Agent Runs'], note: '分解任务、选择教学策略，并协调 Agent 与工具。'},
  {id: '03', name: '学习与知识层', english: 'LEARNER + KNOWLEDGE', items: ['Learner State', 'Memory', 'RAG · Wiki · Skills'], note: '区分长期个人信息、知识来源和对知识点的掌握判断。'},
  {id: '04', name: '模型与工具层', english: 'MODELS + TOOLS', items: ['Model Providers', 'MCP Tools', 'Go · gRPC'], note: '通过模型与工具执行任务；接入细节以项目配置和正式文档为准。'},
  {id: '05', name: '持久化层', english: 'PERSISTENCE', items: ['SQLite', 'Session · Message', 'AgentRun · Audit'], note: '保留对话、运行过程、记忆与来源依据，支持追溯。'},
];

export default function Architecture(): ReactNode {
  return (
    <Layout title="系统架构" description="Converge 的体验、Agent 编排、认知状态、知识与持久化架构。">
      <main className={styles.architecturePage}>
        <PageHero eyebrow="ARCHITECTURE / UNDER THE WORKFLOW" title="每个 Agent，都有明确的职责边界。" description="Converge 将交互、编排、教学判断、知识来源和持久化分层，让一轮学习可以解释、复盘并继续。" actions={<><Button to="/docs" size="large">阅读技术文档</Button><Button to="/developers" size="large" variant="secondary">开发者入口</Button></>} aside={<div className={styles.archHeroCard}><span>REQUEST TRACE / 001</span><div><i>01</i><b>回答进入 Session</b></div><div><i>02</i><b>Socratic Agent 评估</b></div><div><i>03</i><b>知识与记忆提供上下文</b></div><div><i>04</i><b>状态与证据一同更新</b></div><small>每一步保留可追溯的依据</small></div>} />

        <section className={styles.layerSection}>
          <SectionHeading index="01" eyebrow="System layers" title="从交互入口，到可复盘的状态更新。" description="图示说明当前项目的职责划分，不代表每个模块都是独立部署的服务。" />
          <div className={styles.layerMap} aria-label="Converge 系统分层图">
            {layers.map((layer, index) => <div className={styles.layerRow} key={layer.id}>
              <div className={styles.layerMain}><span className={styles.layerIndex}>{layer.id}</span><div className={styles.layerLabel}><small>{layer.english}</small><strong>{layer.name}</strong></div><div className={styles.layerItems}>{layer.items.map(item => <span key={item}>{item}</span>)}</div><p>{layer.note}</p></div>
              {index < layers.length - 1 ? <div className={styles.layerArrow} aria-hidden="true"><span /></div> : null}
            </div>)}
          </div>
        </section>

        <section className={styles.boundaries}>
          <SectionHeading index="02" eyebrow="Important boundaries" title="Memory、知识与认知状态，不是同一件事。" description="将这些概念分开，能让数据来源更清楚，也让教学动作更容易检查。" />
          <div className={styles.boundaryGrid}>
            <article><span>01 / MEMORY</span><h3>关于学习者的信息</h3><p>偏好、目标、约束和长期上下文。项目已有候选审核、来源追踪和本地持久化等机制。</p></article>
            <article><span>02 / KNOWLEDGE</span><h3>知识内容与关系</h3><p>Wiki 页面、检索片段、概念前置关系与 Skills。知识内容提供依据，不等于学习者已掌握。</p></article>
            <article><span>03 / LEARNER STATE</span><h3>学习者当前所处位置</h3><p>掌握度、误解、卡点和对应证据。它应该随着学习行为更新，而不是从聊天记录中猜一个总分。</p></article>
          </div>
        </section>

        <section className={styles.dataTrace}>
          <div><p className={styles.traceKicker}>TRACEABLE BY DESIGN</p><h2>从回答到教学动作，<br />沿途都有依据。</h2><p>Session、Message 与 Agent Run 保存运行过程；教学状态关联具体错误证据和知识来源。</p><Link to="/docs">阅读核心概念 →</Link></div>
          <div className={styles.traceGraph} aria-label="回答、证据、状态、教学动作之间的关系">
            <div><small>INPUT</small><strong>学生回答</strong><span>“函数外也能访问局部变量”</span></div><i>→</i><div><small>EVIDENCE</small><strong>错误模式</strong><span>混淆变量作用范围</span></div><i>→</i><div><small>STATE</small><strong>知识缺口</strong><span>局部作用域待确认</span></div><i>→</i><div className={styles.traceAction}><small>NEXT MOVE</small><strong>教学动作</strong><span>对比代码情境</span></div>
          </div>
        </section>

        <section className={styles.architectureCta}><SectionHeading eyebrow="Go deeper" title="按模块阅读实现与操作文档。" description="从软件手册和具体教程开始；尚未公开或确认的 API 不作推测。" align="center" /><div><Button to="/docs" size="large">打开文档</Button><Button to="/faq" variant="secondary" size="large">查看常见问题</Button></div></section>
      </main>
    </Layout>
  );
}
