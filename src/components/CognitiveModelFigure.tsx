import type {ReactNode} from 'react';
import styles from './CognitiveModelFigure.module.css';

const knowledgeNodes = [
  {id: 'N01', title: '变量与作用域', state: '掌握稳定', kind: 'stable'},
  {id: 'N02', title: '函数与参数', state: '需要补课', kind: 'reinforce'},
  {id: 'N03', title: '递归与调用栈', state: '关系误解', kind: 'misconception'},
  {id: 'N04', title: '指针与引用', state: '证据不足', kind: 'evidence'},
  {id: 'N05', title: '内存模型', state: '掌握稳定', kind: 'stable'},
] as const;

const relations = [
  {label: '先修', kind: 'prerequisite'},
  {label: '关联', kind: 'related'},
  {label: '易混', kind: 'confusion'},
  {label: '支持', kind: 'supports'},
] as const;

const stateDimensions = [
  {index: '01', title: '掌握度', question: '哪些知识点稳定？', example: '变量作用域：稳定', kind: 'mastery'},
  {index: '02', title: '误解', question: '错误关系是什么？', example: '把“引用”理解为“复制对象”', kind: 'misconception'},
  {index: '03', title: '卡点', question: '困难具体在哪里？', example: '递归边界与返回顺序混淆', kind: 'bottleneck'},
  {index: '04', title: '证据链', question: '判断依据是什么？', example: '回答 · 追问 · 提示 · 来源', kind: 'evidence'},
  {index: '05', title: '下一步教学', question: '接下来如何支持？', example: '追问 · 澄清 · 对比练习', kind: 'instruction'},
] as const;

function Arrow(): ReactNode {
  return (
    <svg viewBox="0 0 28 14" aria-hidden="true" focusable="false">
      <path d="M1 7h23M19 2l5 5-5 5" />
    </svg>
  );
}

export default function CognitiveModelFigure(): ReactNode {
  return (
    <figure className={styles.figure} aria-labelledby="cognitive-model-caption">
      <div className={styles.figureTopline}>
        <span>CONCEPTUAL MECHANISM</span>
        <span className={styles.modelStatus}><i />认知状态层：目标模型，尚未在代码中实现</span>
      </div>

      <section className={styles.layer} aria-labelledby="knowledge-layer-title">
        <header className={styles.layerHeader}>
          <span className={styles.layerNumber}>01</span>
          <div>
            <p>知识结构层 · Knowledge graph</p>
            <h3 id="knowledge-layer-title">知识在哪里？</h3>
          </div>
          <span className={styles.layerDescriptor}>节点 · 关系 · 来源</span>
        </header>

        <div className={styles.graphScroll} role="group" tabIndex={0} aria-label="可横向滚动查看知识节点关系">
          <div className={styles.graphTrack}>
            {knowledgeNodes.map((node, index) => (
              <div key={node.id} className={styles.graphItem}>
                <article className={`${styles.knowledgeNode} ${styles[node.kind]}`}>
                  <div className={styles.nodeTopline}>
                    <span>{node.id}</span>
                    <i aria-hidden="true" />
                  </div>
                  <h4>{node.title}</h4>
                  <span className={styles.nodeState}>{node.state}</span>
                </article>
                {index < relations.length ? (
                  <div className={`${styles.relation} ${styles[relations[index].kind]}`} aria-label={`关系：${relations[index].label}`}>
                    <span>{relations[index].label}</span>
                    <Arrow />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.provenance}>
          <span className={styles.provenanceMark} aria-hidden="true">S</span>
          <div><strong>来源可追溯</strong><span>Markdown 事实 · 引用片段 · 页面关系</span></div>
          <div className={styles.lifecycle}><b>草稿</b><Arrow /><b>审核</b><Arrow /><b>正式发布</b></div>
        </div>
      </section>

      <div className={styles.mapping} aria-label="知识网络与认知状态的映射过程">
        <div className={styles.mappingTitle}>
          <span>双层映射</span>
          <p>把知识节点与学习证据关联，形成可解释的状态判断</p>
        </div>
        <div className={styles.mappingSteps}>
          <div><span>01</span><strong>知识定位</strong></div>
          <Arrow />
          <div><span>02</span><strong>证据映射</strong></div>
          <Arrow />
          <div><span>03</span><strong>状态诊断</strong></div>
        </div>
      </div>

      <section className={`${styles.layer} ${styles.learnerLayer}`} aria-labelledby="learner-layer-title">
        <header className={styles.layerHeader}>
          <span className={`${styles.layerNumber} ${styles.layerNumberGreen}`}>02</span>
          <div>
            <p>学习者状态层 · Learner model</p>
            <h3 id="learner-layer-title">学生在知识网络中的哪里？</h3>
          </div>
          <span className={styles.layerDescriptor}>跨会话累积 · 证据驱动</span>
        </header>

        <div className={styles.stateGrid}>
          {stateDimensions.map((dimension) => (
            <article key={dimension.index} className={`${styles.stateDimension} ${styles[dimension.kind]}`}>
              <span className={styles.dimensionIndex}>{dimension.index}</span>
              <h4>{dimension.title}</h4>
              <p>{dimension.question}</p>
              <div className={styles.dimensionExample}>{dimension.example}</div>
            </article>
          ))}
        </div>

        <div className={styles.decisionRule}>
          <span>状态驱动教学动作</span>
          <div><b className={styles.stableDot} />稳定 <Arrow />继续验证</div>
          <div><b className={styles.reinforceDot} />需补课 <Arrow />定向强化</div>
          <div><b className={styles.misconceptionDot} />关系误解 <Arrow />澄清对比</div>
        </div>
      </section>

      <figcaption id="cognitive-model-caption" className={styles.caption}>
        <span>机制要点</span>
        <strong>知识网络描述“知识在哪里”；学习者状态描述“学生在这张网络中的位置”。</strong>
        <span className={styles.captionPrinciples}>证据优先 · 保留不确定性 · 状态持续更新</span>
      </figcaption>
    </figure>
  );
}
