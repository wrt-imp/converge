import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Button} from '../components';
import {CodeWindow, PageHero, SectionHeading} from '../components/SitePrimitives';
import styles from './developers.module.css';

export default function Developers(): ReactNode {
  return (
    <Layout title="开发者" description="本地运行 Converge，了解教学 Skills、MCP 工具、知识检索和 Agent 运行方式。">
      <main className={styles.developerPage}>
        <PageHero eyebrow="DEVELOPER EXPERIENCE / OPEN WORKFLOWS" title="能被理解的 Agent，才能被改进。" description="Converge 的教学策略、知识与工具链尽量保持可读、可检查、可组合。先从本地运行开始，再沿着真实的项目结构深入。" actions={<><Button to="/docs/getting-started/quick-start" size="large">本地快速开始</Button><Button to="/docs/tutorials/use-skills" variant="secondary" size="large">阅读 Skills 教程</Button></>} aside={<CodeWindow filename="terminal" language="SHELL" code={'uv sync\nmake run-app'} accent="RUN CONVERGE LOCALLY" />} />

        <section className={styles.devPrinciples}>
          <SectionHeading index="01" eyebrow="Build with the grain" title="从项目已有的构件出发。" description="不先假设一套新的 SDK 或插件市场。Converge 目前的开发入口来自可读的教学策略、工具协议、知识组织和本地运行环境。" />
          <div className={styles.devPrincipleGrid}><article><span>01</span><h3>Readable Skills</h3><p>将教学策略写成可审阅的 Markdown，而不是隐藏在不透明提示词里。</p><Link to="/docs/tutorials/use-skills">查看 Skills 教程 →</Link></article><article><span>02</span><h3>Connect with MCP</h3><p>通过 MCP 将外部工具接入教学工作流；按项目配置添加可信服务。</p><Link to="/docs/tutorials/use-mcp">查看 MCP 教程 →</Link></article><article><span>03</span><h3>Ground with knowledge</h3><p>使用知识库、Wiki 与 RAG 为解释和教学判断提供可追溯上下文。</p><Link to="/docs/tutorials/use-rag">查看知识检索 →</Link></article></div>
        </section>

        <section className={styles.devWorkflow}>
          <div className={styles.devWorkflowIntro}><p className={styles.devKicker}>A SMALL, REAL EXAMPLE</p><h2>教学规则可以被讨论、<br />审核与版本化。</h2><p>苏格拉底式问答 Skill 将一次学习拆成递进阶段。每一步的目的都能被人读懂，也可以结合项目的 Agent 策略调整。</p></div>
          <div className={styles.devWorkflowPanel}><div className={styles.workflowFile}><span>converge-skills / student</span><b>socratic-questioning.md</b></div><ol><li><i>01</i><span>澄清概念</span><small>确认术语与问题边界</small></li><li><i>02</i><span>追问证据</span><small>要求解释依据</small></li><li><i>03</i><span>探索假设</span><small>比较替代思路</small></li><li><i>04</i><span>推理后果</span><small>检查推论是否成立</small></li><li><i>05</i><span>反思迁移</span><small>回顾卡点与新问题</small></li></ol><p>流程来自当前仓库的教学 Skill。具体使用方式与适用边界见对应教程。</p></div>
        </section>

        <section className={styles.devReferences}>
          <SectionHeading index="02" eyebrow="Developer docs" title="从概念、配置到工具接入。" description="按当前项目资料逐步深入。尚未提供正式契约的远端 API，不展示猜测出来的 endpoint 或 SDK 示例。" />
          <div className={styles.referenceGrid}><Link to="/docs/getting-started/quick-start"><small>01 / START</small><strong>本地启动与快速开始</strong><span>Python、uv 与桌面工作台</span><i>↗</i></Link><Link to="/docs/manual/model-configuration"><small>02 / CONFIG</small><strong>配置模型服务</strong><span>模型提供商、凭据与连接</span><i>↗</i></Link><Link to="/docs/tutorials/use-mcp"><small>03 / TOOLS</small><strong>MCP 工具接入</strong><span>添加服务、连接测试与使用</span><i>↗</i></Link><Link to="/docs/tutorials/use-wiki"><small>04 / KNOWLEDGE</small><strong>Wiki、RAG 与 Memory</strong><span>知识内容、检索与学习上下文</span><i>↗</i></Link></div>
        </section>

        <section className={styles.devApiNote}><div><span>API STATUS</span><h2>接口文档稳定后，再展示集成示例。</h2></div><p>官网服务层为统一请求、类型与后端接入预留位置。当前页面不会调用未经确认的业务 endpoint，也不承诺一个尚未发布的 SDK。</p></section>
      </main>
    </Layout>
  );
}
