import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Button} from '../components';
import {PageHero, SectionHeading, StepSequence} from '../components/SitePrimitives';
import styles from './product.module.css';

const productLoop = ['Observe', 'Diagnose', 'Intervene', 'Verify'];

export default function Product(): ReactNode {
  return (
    <Layout title="产品" description="了解 Converge 如何把学习证据、教学认知状态与多 Agent 教学策略连接起来。">
      <main className={styles.productPage}>
        <PageHero
          eyebrow="PRODUCT / A LEARNING AGENT SYSTEM"
          title="为学习过程而设计的 Agent 系统。"
          description="Converge 不只处理一轮提问。它将回答、知识依据和教学策略组织成能够持续更新的学习状态。"
          actions={<><Button to="/docs" size="large">阅读产品手册</Button><Button to="/architecture" variant="secondary" size="large">探索系统架构</Button></>}
          aside={<div className={styles.productHeroVisual}><span className={styles.visualLabel}>A LEARNING LOOP</span><div className={styles.loopOrbit}><i /><i /><i /><i /><span>STATE<br />UPDATE</span></div><div className={styles.orbitCaption}><b>evidence in</b><span>·</span><b>teaching action out</b></div></div>}
        />

        <section className={styles.productThesis}>
          <SectionHeading index="01" eyebrow="The product shift" title="从聊天历史，走向学习者模型。" description="一次正确回答并不等于掌握。一次错误回答也不代表失败。Converge 关注回答背后的证据，并用新证据修正下一步教学。" />
          <div className={styles.thesisColumns}><div><span>CHAT LOG</span><p>发生了什么？</p><small>消息、时间与轮次</small></div><div className={styles.thesisArrow}>↗</div><div className={styles.thesisTarget}><span>LEARNER STATE</span><p>理解到哪里？</p><small>掌握度、误解、依据与教学动作</small></div></div>
        </section>

        <section className={styles.productBand}>
          <SectionHeading index="02" eyebrow="Core mechanisms" title="三个机制，串起一轮学习。" description="教学不是一个提示词，而是一组相互约束、可以复盘的判断。" />
          <div className={styles.mechanismGrid}>
            <article><span>01 / STATE</span><div className={styles.miniNetwork}><i /><i /><i /><i /><b /></div><h3>认知状态</h3><p>把知识点掌握、知识缺口和错误关系表示为持续更新的学习状态。</p></article>
            <article><span>02 / AGENTS</span><div className={styles.miniAgents}><i>ASK</i><i>CHECK</i><i>TEACH</i></div><h3>教学 Agent</h3><p>以苏格拉底式状态机和可复用 Skills 组织追问、提示与练习。</p></article>
            <article><span>03 / CONTEXT</span><div className={styles.miniContext}><i>MEMORY</i><i>WIKI</i><i>RAG</i><i>MCP</i></div><h3>上下文与工具</h3><p>连接长期记忆、本地知识、检索内容和外部工具，为行动提供依据。</p></article>
          </div>
        </section>

        <section className={styles.productFlow}>
          <SectionHeading index="03" eyebrow="A repeatable loop" title="每次教学动作，都回到证据。" description="流程不是静态的六张卡片；状态在新回答到来后继续更新。" />
          <StepSequence steps={productLoop} />
          <p className={styles.flowNote}>每个阶段都可以关联具体回答、工具结果与知识来源，而不是只留下一个无法解释的分数。</p>
        </section>

        <section className={styles.productProof}>
          <div><p className={styles.proofLabel}>A CONCRETE EXAMPLE</p><h2>变量作用域不只是“会”或“不会”。</h2><p>当学习者能识别局部变量，却把它的可访问范围说得过宽，系统可以分别记录已掌握与待确认的部分，再选择合适的情境追问。</p><Link to="/architecture">看状态如何流转 →</Link></div>
          <div className={styles.proofPanel}><span>CONCEPT / VARIABLE SCOPE</span><div><label>已掌握</label><strong>能识别函数中的局部变量</strong></div><div className={styles.proofGap}><label>待确认</label><strong>变量在何处可以访问</strong></div><div><label>证据</label><strong>把函数内变量判断为函数外可用</strong></div><footer><span>NEXT MOVE</span><b>用两个代码情境对比作用范围</b></footer></div>
        </section>

        <section className={styles.productNext}><SectionHeading eyebrow="Explore Converge" title="从一个真实工作流开始。" description="阅读使用手册，理解 Agent、Memory、RAG、Wiki、Skills 与 MCP 如何组合。" align="center" /><div><Button to="/docs" size="large">打开文档</Button><Button to="/developers" size="large" variant="secondary">开发者入口</Button></div></section>
      </main>
    </Layout>
  );
}
