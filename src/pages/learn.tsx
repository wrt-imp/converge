import {useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Button} from '../components';
import {useWorkspace, type LearningMode} from '../components/WorkspaceProvider';
import styles from '../components/Workspace.module.css';

const modes: {id: LearningMode; title: string; description: string}[] = [
  {id: 'question', title: '理解一个问题', description: '梳理概念、方法与问题边界'},
  {id: 'guided', title: '一步步思考', description: '通过追问，逐步表达自己的理解'},
  {id: 'materials', title: '结合资料学习', description: '围绕自己的教材、讲义和笔记提问'},
];

export default function Learn(): ReactNode {
  const {drafts, resources, addDraft} = useWorkspace();
  const [mode, setMode] = useState<LearningMode>('question');
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const available = resources.filter(item => item.status === 'local');
  function saveDraft() {
    if (!message.trim()) return;
    addDraft({text: message.trim(), mode, resourceNames: available.filter(item => selected.includes(item.id)).map(item => item.name)});
    setMessage('');
    setNotice('草稿已保留在当前标签页内，未发送给模型。刷新后清空。');
  }
  return <Layout title="学习工作台" description="围绕问题、思考与自己的学习资料，准备下一轮学习。">
    <main className={styles.workspace} data-online-workspace>
      <div className={styles.topline}><span>CONVERGE / LEARNING WORKSPACE</span><span className={styles.status}>前端预览 · 后端未接入</span></div>
      <div className={styles.heading}><div><p className={styles.eyebrow}>从一个真实问题开始</p><h1>把问题讲清楚<br /><span>让理解更进一步</span></h1></div><p>不限定学科，也不急着给出答案。<br />先整理问题、思路，以及你想参考的资料。</p></div>
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="当前标签页草稿">
          <span className={styles.label}>学习记录</span><h2>从这里继续</h2>
          <p>目前仅保留本次打开的草稿，不是服务器会话记录。</p>
          {drafts.length === 0 ? <div className={styles.emptySmall}>还没有草稿<br /><span>写下问题，保存你的学习起点</span></div> : <ol className={styles.draftList}>{drafts.map((draft, index) => <li key={draft.id}><a href={`#${draft.id}`}> <span>{String(index + 1).padStart(2, '0')}</span>{draft.text.slice(0, 32)}</a></li>)}</ol>}
          <Link to="/docs/tutorials/socratic-learning">了解引导式学习 →</Link>
        </aside>
        <section className={styles.panel} aria-labelledby="learning-panel-title">
          <div className={styles.panelTop}><span className={styles.label}>01 / PREPARE</span><span>问题 → 思考 → 依据</span></div>
          <h2 id="learning-panel-title">今天，你想理解什么</h2>
          <fieldset className={styles.modes}><legend className={styles.srOnly}>选择学习方式</legend>{modes.map(item => <label key={item.id} className={mode === item.id ? styles.modeActive : styles.mode}><input type="radio" name="learning-mode" value={item.id} checked={mode === item.id} onChange={() => setMode(item.id)} /><strong>{item.title}</strong><span>{item.description}</span></label>)}</fieldset>
          <form onSubmit={event => {event.preventDefault(); saveDraft();}}>
            <label className={styles.inputLabel} htmlFor="learning-question">你的问题与已有思路</label>
            <textarea id="learning-question" maxLength={12000} value={message} onChange={event => setMessage(event.target.value)} placeholder="可以从任何学科开始：你正在理解什么？已经尝试了什么？卡在哪里？" rows={5} />
            {mode === 'materials' && <fieldset className={styles.resourceChoices}><legend>选择本地资料</legend>{available.length ? available.map(item => <label key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={event => setSelected(current => event.target.checked ? [...current, item.id] : current.filter(id => id !== item.id))} />{item.name}</label>) : <p>尚未选择文本资料。<Link to="/resources">前往资料库</Link></p>}</fieldset>}
            <div className={styles.composerFoot}><span>{message.length.toLocaleString()} / 12,000</span><Button type="submit" disabled={!message.trim()}>保存学习草稿 <span aria-hidden="true">↗</span></Button></div>
          </form>
          <p role="status" className={styles.notice}>{notice}</p>
          {drafts.length > 0 && <section className={styles.savedDrafts} aria-label="已保存草稿"><h3>已整理的问题</h3>{drafts.map(draft => <article key={draft.id} id={draft.id}><header><span>{modes.find(item => item.id === draft.mode)?.title}</span><small>本地草稿 · 未发送</small></header><p>{draft.text}</p>{draft.resourceNames.length > 0 && <small>参考资料名称：{draft.resourceNames.join('、')}（未上传）</small>}</article>)}</section>}
        </section>
      </div>
      <footer className={styles.workspaceFoot}><span>学习不止一种路径</span><Link to="/resources">整理学习资料 →</Link><Link to="/docs">阅读使用手册 →</Link></footer>
    </main>
  </Layout>;
}
