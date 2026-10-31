import {useEffect, useReducer, type CSSProperties, type ReactNode} from 'react';
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

const mechanismStages = [
  {label: '01 / OBSERVE', tab: '学习信号', title: '看见学习过程', detail: '从回答、探索与练习中，捕捉学习信号。', caption: '回答 · 探索 · 练习'},
  {label: '02 / CONNECT', tab: '证据关联', title: '连接学习证据', detail: '把过程、知识依据与反馈放到一起理解。', caption: '目标 · 过程 · 依据'},
  {label: '03 / UNDERSTAND', tab: '状态理解', title: '形成动态理解', detail: '持续辨认已掌握之处与仍需支持的部分。', caption: '理解 · 迁移 · 巩固'},
  {label: '04 / SUPPORT', tab: '教学支持', title: '给出下一步支持', detail: '根据当前状态，选择合适的解释、引导或练习。', caption: '解释 · 引导 · 验证'},
];

const mechanismStageDuration = 5000;
type CarouselDirection = 'forward' | 'backward';
type CarouselState = {active: number; previous: number | null; elapsed: number; playing: boolean; direction: CarouselDirection};
type CarouselAction = {type: 'tick'; delta: number} | {type: 'go'; index: number; direction?: CarouselDirection} | {type: 'play' | 'pause' | 'toggle' | 'replay'};

function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case 'play': return {...state, playing: true};
    case 'pause': return {...state, playing: false};
    case 'toggle': return {...state, playing: !state.playing};
    case 'replay': return {...state, previous: state.active === 0 ? state.previous : state.active, active: 0, elapsed: 0, playing: true, direction: 'forward'};
    case 'go': {
      const active = (action.index + mechanismStages.length) % mechanismStages.length;
      return {...state, active, previous: active === state.active ? state.previous : state.active, elapsed: 0, direction: action.direction ?? (active > state.active ? 'forward' : 'backward')};
    }
    case 'tick': {
      if (!state.playing) return state;
      const elapsed = state.elapsed + action.delta;
      if (elapsed < mechanismStageDuration) return {...state, elapsed};
      return {...state, previous: state.active, active: (state.active + 1) % mechanismStages.length, elapsed: elapsed % mechanismStageDuration, direction: 'forward'};
    }
  }
}

function MechanismVisual({stage}: {stage: number}): ReactNode {
  if (stage === 0) return (
    <div className={styles.signalStudy}>
      <div className={styles.signalDocument}><span>LEARNING NOTE</span><strong>从一次表达开始</strong><div className={styles.signalLines}><i /><i /><i /></div><small>记录思路，发现线索。</small></div>
      <div className={styles.signalWords}><b>回答</b><b>探索</b><b>练习</b></div>
    </div>
  );
  if (stage === 1) return (
    <div className={styles.evidenceMap}>
      <svg viewBox="0 0 300 230" aria-hidden="true" focusable="false"><path d="M62 46 L150 115 L238 46 M62 184 L150 115 L238 184" /><circle cx="150" cy="115" r="31" /></svg>
      <span>学习目标</span><b>知识依据</b><strong>过程记录</strong><em>学习反馈</em><small>关联</small>
    </div>
  );
  if (stage === 2) return (
    <div className={styles.modelStudy}><span className={styles.modelStudyLabel}>LEARNER STATE</span><div className={styles.modelRows}><span>概念理解</span><i><b style={{width: '82%'}} /></i><small>稳定</small><span>迁移应用</span><i><b style={{width: '48%'}} /></i><small>发展中</small><span>长期保持</span><i><b style={{width: '31%'}} /></i><small>待观察</small></div><p>用新证据，继续更新理解。</p></div>
  );
  return (
    <div className={styles.supportStudy}><div className={styles.supportCheck} aria-hidden="true">✓</div><div className={styles.supportCard}><span>THE NEXT LEARNING MOVE</span><strong>适合此刻的学习支持</strong><div><b>解释</b><b>引导</b><b>练习</b></div><small>结合状态，继续验证。</small></div></div>
  );
}

function MechanismScene(): ReactNode {
  const [state, dispatch] = useReducer(carouselReducer, {active: 0, previous: null, elapsed: 0, playing: false, direction: 'forward'});

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = (): void => dispatch({type: preference.matches ? 'pause' : 'play'});
    const frame = window.requestAnimationFrame(() => {
      syncPreference();
    });
    preference.addEventListener('change', syncPreference);
    return () => {
      window.cancelAnimationFrame(frame);
      preference.removeEventListener('change', syncPreference);
    };
  }, []);

  useEffect(() => {
    if (!state.playing) return undefined;
    let lastTick = window.performance.now();
    const timer = window.setInterval(() => {
      const now = window.performance.now();
      const delta = Math.min(now - lastTick, 250);
      lastTick = now;
      if (!document.hidden) dispatch({type: 'tick', delta});
    }, 50);
    return () => window.clearInterval(timer);
  }, [state.playing]);

  return (
    <div id="mechanism-demo" className={styles.mechanismScene} data-direction={state.direction} role="region" aria-roledescription="轮播" aria-label="Converge 学习机制演示" onKeyDown={(event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 'forward' : 'backward';
      dispatch({type: 'go', index: state.active + (direction === 'forward' ? 1 : -1), direction});
    }}>
      <div className={styles.sceneStageViewport}>
        <div className={styles.paperStack} aria-hidden="true"><i /><i /></div>
        {mechanismStages.map((stage, index) => (
          <article key={stage.label} className={clsx(styles.storyPage, index === state.active && styles.storyPageActive, index === state.previous && index !== state.active && styles.storyPageLeaving)} role="group" aria-roledescription="幻灯片" aria-label={`${index + 1} / 4：${stage.title}`} aria-hidden={index !== state.active}>
            <div className={styles.storyPageTop}><span>{stage.label}</span><span>CONCEPT / {String(index + 1).padStart(2, '0')}</span></div>
            <div className={styles.storyPageBody}>
              <div className={styles.storyStageHeading}><h2><span>{stage.title.slice(0, 2)}</span>{stage.title.slice(2)}</h2><p>{stage.detail}</p></div>
              <div className={styles.storyIllustration}><MechanismVisual stage={index} /></div>
            </div>
            <div className={styles.storyPageFoot}><span>{stage.caption}</span><b>{String(index + 1).padStart(2, '0')} <i>/ 04</i></b></div>
          </article>
        ))}
      </div>
      <div className={styles.sceneControls}>
        <div className={styles.sceneProgress} role="group" aria-label="机制动画进度">
          {mechanismStages.map((stage, index) => <button key={stage.label} type="button" className={clsx(styles.progressStep, index === state.active && styles.progressStepActive)} onClick={() => dispatch({type: 'go', index})} aria-label={`查看阶段：${stage.title}`} aria-current={index === state.active ? 'step' : undefined}><span><b>{stage.label.slice(0, 2)}</b>{stage.tab}</span><i><b style={{transform: `scaleX(${index < state.active ? 1 : index === state.active ? state.elapsed / mechanismStageDuration : 0})`}} /></i></button>)}
        </div>
        <div className={styles.sceneControlBottom}><div className={styles.sceneButtons}>
          <button type="button" onClick={() => dispatch({type: 'go', index: state.active - 1, direction: 'backward'})} aria-label="上一幕">←</button>
          <button type="button" onClick={() => dispatch({type: state.playing ? 'pause' : 'play'})} aria-label={state.playing ? '暂停演示' : '继续演示'} aria-pressed={state.playing}>{state.playing ? '暂停' : '播放'} <span aria-hidden="true">{state.playing ? 'Ⅱ' : '▶'}</span></button>
          <button type="button" onClick={() => dispatch({type: 'go', index: state.active + 1, direction: 'forward'})} aria-label="下一幕">→</button>
          <button type="button" onClick={() => dispatch({type: 'replay'})} aria-label="从第一幕重新播放">↺</button>
        </div></div>
      </div>
      <span className={styles.carouselAnnouncement} aria-live="polite" aria-atomic="true">{state.playing ? '' : `第 ${state.active + 1} 幕：${mechanismStages[state.active].title}。轮播已暂停。`}</span>
    </div>
  );
}
function StateComparison(): ReactNode {
  return (
    <div className={styles.comparison}>
      <div className={styles.comparisonSide}><span>CHAT HISTORY</span><p>“我大概理解这个知识点。”</p><small>一条消息，停在对话里</small></div>
      <div className={styles.comparisonArrow} aria-hidden="true">↗</div>
      <div className={styles.comparisonFocus}><span>LEARNER MODEL</span><p>“基本理解已建立，迁移应用仍需巩固。”</p><small>知识状态 · 学习证据 · 下一步支持</small></div>
    </div>
  );
}

function FeatureVisual({index}: {index: number}): ReactNode {
  if (index === 0) {
    return <div className={styles.stateVisual}>
      <div className={styles.stateVisualHeader}><span>LEARNING STATE / GENERAL MODEL</span><span className={styles.statePill}>IN PROGRESS</span></div>
      <div className={styles.stateBars}><div><span>概念理解</span><i><b style={{width: '82%'}} /></i><strong>稳定</strong></div><div><span>迁移应用</span><i><b style={{width: '34%'}} /></i><strong>发展中</strong></div><div><span>长期保持</span><i><b style={{width: '57%'}} /></i><strong>待观察</strong></div></div>
      <div className={styles.visualCaption}>LEARNING STATE IS CONTEXTUAL — NOT A FIXED SCORE</div>
    </div>;
  }
  if (index === 1) {
    return <div className={styles.sourceVisual}>
      <div className={styles.sourceNode}><span>LEARNING GOAL</span><strong>如何理解并应用这个知识点？</strong></div>
      <div className={styles.sourceConnector}>↓</div>
      <div className={styles.sourcePair}><div><span>LEARNING MEMORY</span><strong>已有进展与偏好</strong></div><div><span>WIKI + RAG</span><strong>学科知识依据</strong></div></div>
      <div className={styles.sourceConnector}>↓</div>
      <div className={styles.sourceNode + ' ' + styles.sourceConclusion}><span>LEARNING EVIDENCE</span><strong>让判断有据可循</strong></div>
    </div>;
  }
  return <div className={styles.strategyVisual}>
    <div className={styles.strategySignal}><span>LEARNER SIGNAL</span><strong>“我理解了，但还不确定能否自己运用。”</strong></div>
    <div className={styles.strategyPath}><span>01</span><b>识别当前理解</b><i>→</i></div>
    <div className={styles.strategyPath}><span>02</span><b>结合目标与学习证据</b><i>→</i></div>
    <div className={styles.strategyPath + ' ' + styles.strategyChosen}><span>03</span><b>匹配下一步学习支持</b><i>✓</i></div>
  </div>;
}

export default function Home(): ReactNode {
  return (
    <Layout title="适用于多学科的 AI 学习协作平台" description="Converge 将不同学科的学习目标、过程证据与认知状态连接起来，支持个性化教学与持续学习。">
      <main className={styles.home}>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroNoise} aria-hidden="true" />
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}><span /> CONVERGE / LEARNING SYSTEM 01</p>
              <h1 id="hero-title">让学习状态，<em>成为教学的下一步</em></h1>
              <p className={styles.heroLead}>面向不同学科的学习与教学场景，Converge 将学习证据、认知状态与 Multi-Agent 协作连接起来，让每一步学习支持都有据可循。</p>
              <div className={styles.heroActions}>
                <Button to="/learn" size="large">进入学习工作台 <span aria-hidden="true">↘</span></Button>
                <Link className={styles.heroTextLink} to="/docs">阅读快速开始 <span aria-hidden="true">→</span></Link>
              </div>
              <p className={styles.heroMeta}>LEARNER MODEL <i /> AGENT COLLABORATION <i /> TEACHING LOOP</p>
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
              <MechanismScene />
            </div>
          </div>
          <a className={styles.scrollHint} href="#positioning"><span /> SCROLL TO EXPLORE</a>
        </section>

        <section className={styles.positioning} id="positioning">
          <div className={styles.positioningIntro}>
            <p className={styles.kicker}>THE SHIFT / 01</p>
            <h2>聊天结束了<br /><em>理解不该重置</em></h2>
          </div>
          <div className={styles.positioningBody}>
            <p>大多数对话系统记下说过什么。Converge 进一步追问：学会了什么，哪里还不稳，下一步如何教？</p>
            <StateComparison />
          </div>
        </section>

        <section className={styles.capabilities} id="product">
          <div className={styles.sectionHeadRow}>
            <div><p className={styles.kicker}>A LEARNING SYSTEM / 02</p><h2>从学习信号，<br />到有依据的教学动作</h2></div>
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
            <h2>一次回答，<br /><em>启动一条教学路径</em></h2>
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
            <h2>教学策略，<br /><em>写得清楚，也能复用</em></h2>
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
            <div><p className={styles.kicker}>SYSTEM MAP / 05</p><h2>多 Agent，不是<br /><em>多一层黑盒</em></h2></div>
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
            <h2>先看它如何思考<br /><em>再决定怎么构建</em></h2>
            <div className={styles.ctaActions}><Button to="/docs" size="large">打开软件手册</Button><Link to="/community">查看项目与贡献方式 →</Link></div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
