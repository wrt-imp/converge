import type {CSSProperties, ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {Button} from '../components';
import {CodeWindow, StepSequence} from '../components/SitePrimitives';
import styles from './index.module.css';

const features = [
  {number: '01', title: 'Model the learner', text: '把掌握度、知识缺口和可能的误解表示成持续变化的状态。', tag: 'LEARNER STATE'},
  {number: '02', title: 'Ground every decision', text: '把教学判断关联到回答、追问、练习与可检索的知识依据。', tag: 'EVIDENCE · RAG · WIKI'},
  {number: '03', title: 'Choose the next move', text: '由教学策略决定追问、提示、反例、练习，或适时解释。', tag: 'SOCRATIC · SKILLS'},
];

type HeroParticle = [number, number, number, number, number, number];

const heroParticles: HeroParticle[] = [
  [3, 11, 10, -9, 8.4, -1.7], [9, 21, -8, 12, 10.2, -5.1], [16, 5, 7, 10, 7.6, -3.4],
  [22, 17, -12, -7, 9.8, -2.2], [28, 6, 9, -13, 11.3, -7.4], [34, 23, -7, 9, 8.9, -4.8],
  [41, 4, 12, 8, 10.7, -6.3], [47, 15, -9, -11, 7.9, -2.9], [54, 7, 8, 13, 12.1, -8.2],
  [61, 20, -11, 7, 9.2, -1.2], [68, 5, 7, -10, 11.6, -5.7], [76, 16, -8, 12, 8.1, -3.9],
  [84, 8, 11, -8, 10.4, -7.1], [94, 20, -10, 9, 9.6, -4.2], [6, 43, 8, -12, 11.2, -6.8],
  [14, 57, -11, 8, 8.7, -2.6], [24, 72, 9, -10, 10.9, -5.4], [34, 88, -8, -9, 7.8, -1.9],
  [43, 77, 12, 7, 12.4, -8.8], [52, 93, -10, -8, 9.1, -3.1], [63, 81, 8, 11, 10.1, -6.1],
  [73, 91, -12, -7, 8.3, -2.4], [82, 70, 9, 10, 11.8, -7.9], [93, 84, -8, -11, 9.4, -4.5],
  [2, 79, 11, 8, 10.6, -6.6], [18, 34, -9, -10, 8.2, -1.4], [31, 48, 10, 11, 11.5, -8.5],
  [70, 39, -11, -8, 9.7, -3.6], [89, 48, 8, 12, 12.2, -7.6], [98, 61, -10, -9, 8.6, -2.8],
  [1, 8, -8, 11, 7.2, -3.7], [5, 26, 12, -8, 8.8, -6.4], [8, 15, -10, -12, 9.3, -1.5],
  [11, 4, 7, 9, 10.8, -5.8], [19, 11, -9, 13, 7.7, -4.6], [25, 2, 11, -7, 9.9, -7.2],
  [37, 12, -12, 8, 8.5, -2.7], [45, 2, 9, 12, 11.1, -6.9], [57, 14, -7, -12, 7.5, -3.3],
  [66, 9, 12, -9, 10.5, -8.1], [79, 3, -11, 8, 8.1, -1.8], [88, 14, 8, 12, 11.7, -5.2],
  [96, 7, -9, -10, 9.1, -4.1], [99, 28, 10, 7, 7.9, -7.7], [3, 34, 11, 9, 10.2, -2.3],
  [8, 52, -8, 12, 7.4, -6.2], [12, 68, 10, -9, 9.6, -3.8], [20, 84, -12, 8, 11.4, -8.4],
  [29, 96, 8, -11, 8.6, -1.1], [39, 91, -9, -12, 10.7, -5.6], [48, 84, 11, 9, 7.8, -7.3],
  [59, 96, -10, -8, 9.4, -2.5], [69, 88, 8, 12, 11.9, -6.7], [77, 98, -11, -9, 8.2, -4.3],
  [86, 90, 12, 7, 10.1, -1.6], [95, 96, -8, -12, 7.6, -5.9], [97, 74, 10, 9, 9.8, -3.2],
  [7, 31, -9, 10, 8.3, -6.1], [8, 63, 11, -8, 10.6, -2.1], [9, 91, -10, -9, 7.9, -4.7],
  [91, 29, 8, -11, 9.5, -7.5], [92, 58, -12, 9, 11.2, -3.5], [93, 93, 9, -10, 8.7, -1.3],
  [4, 16, 12, 8, 10.3, -8.3], [6, 47, -8, -12, 7.5, -5.5], [5, 73, 10, 11, 9.2, -2.9],
  [95, 41, -11, 8, 11.6, -6.5], [94, 68, 9, 12, 8.4, -3.1], [96, 87, -10, -7, 10.8, -7.8],
  ...Array.from({length: 48}, (_, index): HeroParticle => {
    const lane = index % 4;
    const offset = Math.floor(index / 4);
    const edge = 2 + ((offset * 7) % 8);
    const along = 5 + ((offset * 23) % 91);
    const x = lane === 0 ? edge : lane === 1 ? 100 - edge : along;
    const y = lane === 2 ? edge : lane === 3 ? 100 - edge : along;
    const driftX = ((index * 17) % 25) - 12;
    const driftY = ((index * 11 + 5) % 25) - 12;
    const duration = 7 + ((index * 13) % 50) / 10;
    const delay = -((index * 19) % 90) / 10;

    return [x, y, driftX, driftY, duration, delay];
  }),
];

type ParticleStyle = CSSProperties & {
  '--drift-x': string;
  '--drift-y': string;
  '--return-x': string;
  '--return-y': string;
  '--settle-x': string;
  '--settle-y': string;
};

function WorkbenchDemo(): ReactNode {
  return (
    <div className={styles.demoFrame} aria-label="Converge 教学认知状态机制示意">
      <div className={styles.demoTopbar}>
        <div className={styles.demoBrand}><span className={styles.brandMark}>C</span><span>CONVERGE</span></div>
        <span className={styles.demoProject}>LEARNING SESSION / 04</span>
        <span className={styles.liveStatus}><i /> STATE UPDATED</span>
      </div>
      <div className={styles.demoBody}>
        <div className={styles.stateCanvas}>
          <div className={styles.canvasHeading}><span>LEARNER STATE</span><span>CONFIDENCE 0.82</span></div>
          <div className={styles.graphVisual}>
            <svg viewBox="0 0 480 210" role="img" aria-label="变量作用域概念与学习证据的关系图">
              <path d="M82 98 C148 98 145 48 220 48 S304 98 386 98" />
              <path d="M82 98 C148 98 145 160 220 160 S304 98 386 98" />
              <path className={styles.graphActive} d="M220 48 C282 48 304 98 386 98" />
              <circle cx="82" cy="98" r="10" /><circle cx="220" cy="48" r="10" />
              <circle cx="220" cy="160" r="10" /><circle className={styles.graphFocus} cx="386" cy="98" r="12" />
            </svg>
            <span className={clsx(styles.graphLabel, styles.graphLabelA)}>函数</span>
            <span className={clsx(styles.graphLabel, styles.graphLabelB)}>局部变量</span>
            <span className={clsx(styles.graphLabel, styles.graphLabelC)}>作用范围</span>
            <span className={clsx(styles.graphLabel, styles.graphLabelD)}>当前卡点</span>
          </div>
          <div className={styles.evidenceCard}>
            <div className={styles.evidenceIcon}>↳</div>
            <div><small>OBSERVED EVIDENCE</small><strong>两次混淆局部变量的作用范围</strong></div>
            <span className={styles.evidenceScore}>2×</span>
          </div>
        </div>
        <aside className={styles.agentRail} aria-label="Agent 运行记录">
          <div className={styles.railHeading}>AGENT RUN <span>03 steps</span></div>
          <div className={styles.runItem}><i className={styles.runDotDone} /><div><strong>Tutor Agent</strong><span>识别学习目标</span></div><small>DONE</small></div>
          <div className={styles.runItem}><i className={styles.runDotDone} /><div><strong>Evidence Check</strong><span>定位重复错误</span></div><small>DONE</small></div>
          <div className={styles.runItem}><i className={styles.runDotNow} /><div><strong>Next Teaching Move</strong><span>生成情境对比追问</span></div><small>NOW</small></div>
          <div className={styles.nextMove}><span>NEXT QUESTION</span><p>这个变量在函数外部也能被访问吗？为什么？</p><i>→</i></div>
        </aside>
      </div>
      <div className={styles.demoFoot}><span>机制示意 · 非产品截图</span><span>Evidence → State → Action</span></div>
    </div>
  );
}
function StateComparison(): ReactNode {
  return (
    <div className={styles.comparison}>
      <div className={styles.comparisonSide}><span>CHAT HISTORY</span><p>“我知道局部变量。”</p><small>一条消息，停在对话里</small></div>
      <div className={styles.comparisonArrow} aria-hidden="true">↗</div>
      <div className={styles.comparisonFocus}><span>LEARNER MODEL</span><p>“能识别局部变量，但作用范围还不确定。”</p><small>知识点 · 错误证据 · 下一步教学</small></div>
    </div>
  );
}

function FeatureVisual({index}: {index: number}): ReactNode {
  if (index === 0) {
    return <div className={styles.stateVisual}>
      <div className={styles.stateVisualHeader}><span>CONCEPT / VARIABLE SCOPE</span><span className={styles.statePill}>IN PROGRESS</span></div>
      <div className={styles.stateBars}><div><span>定义位置</span><i><b style={{width: '82%'}} /></i><strong>0.82</strong></div><div><span>可访问范围</span><i><b style={{width: '34%'}} /></i><strong>0.34</strong></div><div><span>生命周期</span><i><b style={{width: '57%'}} /></i><strong>0.57</strong></div></div>
      <div className={styles.visualCaption}>STATE IS A MODEL — NOT A SCORE</div>
    </div>;
  }
  if (index === 1) {
    return <div className={styles.sourceVisual}>
      <div className={styles.sourceNode}><span>QUESTION</span><strong>变量在哪里可用？</strong></div>
      <div className={styles.sourceConnector}>↓</div>
      <div className={styles.sourcePair}><div><span>MEMORY</span><strong>学习偏好</strong></div><div><span>WIKI + RAG</span><strong>概念依据</strong></div></div>
      <div className={styles.sourceConnector}>↓</div>
      <div className={styles.sourceNode + ' ' + styles.sourceConclusion}><span>TEACHING EVIDENCE</span><strong>以可回溯依据组织判断</strong></div>
    </div>;
  }
  return <div className={styles.strategyVisual}>
    <div className={styles.strategySignal}><span>STUDENT RESPONSE</span><strong>“局部变量到处都能用。”</strong></div>
    <div className={styles.strategyPath}><span>01</span><b>不直接揭晓答案</b><i>→</i></div>
    <div className={styles.strategyPath}><span>02</span><b>检查错误概念</b><i>→</i></div>
    <div className={styles.strategyPath + ' ' + styles.strategyChosen}><span>03</span><b>用情境对比确认作用范围</b><i>✓</i></div>
  </div>;
}

export default function Home(): ReactNode {
  return (
    <Layout title="理解学习者的 AI Agent 工作台" description="Converge 将教学认知状态、学习证据与 Multi-Agent 协作连接为可追踪的学习闭环。">
      <main className={styles.home}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroNoise} aria-hidden="true" />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}><span /> CONVERGE / LEARNING AGENT SYSTEM</p>
              <h1 id="hero-title">让 Agent 理解学习者，<em>而不只理解提示词。</em></h1>
              <p className={styles.heroLead}>一个以教学认知状态为核心的 Multi-Agent 工作台。把回答变成证据，把证据变成下一步教学。</p>
              <div className={styles.heroActions}>
                <Button to="/product" size="large">看 Agent 如何协作 <span aria-hidden="true">↘</span></Button>
                <Link className={styles.heroTextLink} to="/docs">阅读快速开始 <span aria-hidden="true">→</span></Link>
              </div>
              <p className={styles.heroMeta}>LEARNER STATE <i /> MULTI-AGENT <i /> EVIDENCE-LED</p>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.particleField} aria-hidden="true">
                {heroParticles.map(([x, y, dx, dy, duration, delay], index) => (
                  <i
                    className={styles.particle}
                    key={index}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      '--drift-x': `${dx}px`,
                      '--drift-y': `${dy}px`,
                      '--return-x': `${-dx * 0.55}px`,
                      '--return-y': `${-dy * 0.45}px`,
                      '--settle-x': `${dx * 0.45}px`,
                      '--settle-y': `${dy * 0.55}px`,
                      animationDuration: `${duration}s`,
                      animationDelay: `${delay}s`,
                    } as ParticleStyle}
                  />
                ))}
              </div>
              <WorkbenchDemo />
            </div>
          </div>
          <a className={styles.scrollHint} href="#positioning"><span /> SCROLL TO EXPLORE</a>
        </section>

        <section className={styles.positioning} id="positioning">
          <div className={styles.positioningIntro}>
            <p className={styles.kicker}>THE SHIFT / 01</p>
            <h2>聊天结束了。<br /><em>理解不该重置。</em></h2>
          </div>
          <div className={styles.positioningBody}>
            <p>大多数对话系统记下说过什么。Converge 进一步追问：学会了什么，哪里还不稳，下一步如何教？</p>
            <StateComparison />
          </div>
        </section>

        <section className={styles.capabilities} id="product">
          <div className={styles.sectionHeadRow}>
            <div><p className={styles.kicker}>A LEARNING SYSTEM / 02</p><h2>从学习信号，<br />到有依据的教学动作。</h2></div>
            <p className={styles.sectionAside}>不是把 Agent 越堆越多。是让每个教学决策都能回到学习证据。</p>
          </div>
          <div className={styles.featureList}>
            {features.map((feature, index) => (
              <article className={styles.featureRow} key={feature.number}>
                <div className={styles.featureCopy}>
                  <span className={styles.featureNumber}>{feature.number} / {feature.tag}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <Link to={index === 0 ? '/product' : '/docs'} className={styles.inlineLink}>探索机制 <span aria-hidden="true">↗</span></Link>
                </div>
                <FeatureVisual index={index} />
              </article>
            ))}
          </div>
        </section>

        <section className={styles.workflow} id="how-it-works">
          <div className={styles.workflowIntro}>
            <p className={styles.kicker}>AGENT PIPELINE / 03</p>
            <h2>一次回答，<br /><em>启动一条教学路径。</em></h2>
            <p>Agent 根据目标、回答和错误证据协作，再把判断送回下一步教学。过程清晰、可以继续、可以复盘。</p>
          </div>
          <div className={styles.pipelineWrap}>
            <StepSequence steps={['学习者表达', '识别目标', '评估证据', '协作诊断', '选择教学动作']} dark />
            <div className={styles.pipelineFoot}><span>INPUT</span><span>ORCHESTRATION</span><span>STATE UPDATE</span></div>
          </div>
        </section>

        <section className={styles.developer} id="developers">
          <div className={styles.developerCopy}>
            <p className={styles.kicker}>FOR BUILDERS / 04</p>
            <h2>教学策略，<br /><em>写得清楚，也能复用。</em></h2>
            <p>从可读的 Skills 到 MCP 工具接入，从本地知识到可追踪的 Agent Run。沿用开放的开发工作流，不把教学策略锁进黑盒。</p>
            <div className={styles.devLinks}><Link to="/developers">开发者入口 <span>↗</span></Link><Link to="/docs/tutorials/use-skills">Skills 教程 <span>↗</span></Link></div>
          </div>
          <div className={styles.developerCode}>
            <CodeWindow filename="socratic-questioning.md" language="MARKDOWN" accent="A TEACHING SKILL" code={'## 执行流程\n\n1. 澄清概念\n2. 追问证据\n3. 探索假设\n4. 推理后果\n5. 反思迁移\n\n一次只问一个问题。\n根据回答调整下一步。'} />
            <p className={styles.codeNote}>一个真实的项目教学策略文件 · Markdown 可读，可持续迭代</p>
          </div>
        </section>

        <section className={styles.architecture} id="architecture">
          <div className={styles.architectureTop}>
            <div><p className={styles.kicker}>SYSTEM MAP / 05</p><h2>多 Agent，不是<br /><em>多一层黑盒。</em></h2></div>
            <p>从用户交互到状态更新，每一层都有明确职责。知识来源、工具执行与持久化彼此分离。</p>
          </div>
          <div className={styles.architectureMap} aria-label="Converge 系统架构简图">
            <div className={styles.archLayer}><span>01 / EXPERIENCE</span><strong>Desktop Workspace</strong><small>Chat · Wiki · Learning</small></div>
            <div className={styles.layerLink} aria-hidden="true">↓</div>
            <div className={styles.archLayer + ' ' + styles.archLayerActive}><span>02 / ORCHESTRATION</span><strong>Agent Runtime</strong><small>Socratic Agent · Task Orchestration · Multi-Agent</small></div>
            <div className={styles.layerSplit}><div><span>03A / LEARNER MODEL</span><strong>State · Evidence</strong></div><div><span>03B / KNOWLEDGE</span><strong>RAG · Wiki · Skills</strong></div><div><span>03C / CONTEXT</span><strong>Memory · Session</strong></div></div>
            <div className={styles.layerLink} aria-hidden="true">↓</div>
            <div className={styles.archLayer}><span>04 / INFRASTRUCTURE</span><strong>Models · Tools · Storage</strong><small>MCP · Go / gRPC · SQLite</small></div>
          </div>
          <Link className={styles.archLink} to="/architecture">查看完整架构说明 <span>↗</span></Link>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.ctaGrid}>
            <p className={styles.kicker}>START WITH THE SYSTEM</p>
            <h2>先看它如何思考。<br /><em>再决定怎么构建。</em></h2>
            <div className={styles.ctaActions}><Button to="/docs" size="large">打开软件手册</Button><Link to="/community">查看项目与贡献方式 →</Link></div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
