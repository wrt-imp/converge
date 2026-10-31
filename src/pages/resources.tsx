import {useRef, useState, type ReactNode, type ChangeEvent} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Button} from '../components';
import {useWorkspace, type LocalResource} from '../components/WorkspaceProvider';
import styles from '../components/Workspace.module.css';

export default function Resources(): ReactNode {
  const {resources, addResources, removeResource} = useWorkspace();
  const [query, setQuery] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const preview = resources.find(item => item.id === previewId);
  const visible = resources.filter(item => `${item.name}\n${item.text ?? ''}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  async function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;
    setBusy(true);
    const accepted: LocalResource[] = [];
    const errors: string[] = [];
    try {
      if (resources.length + files.length > 20) {setNotice('当前标签页最多保留 20 个文件，请先移除部分文件。'); return;}
      for (const file of files) {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension || !['txt', 'md', 'pdf', 'docx'].includes(extension)) {errors.push(`${file.name}：暂不支持此格式`); continue;}
        const textFile = extension === 'txt' || extension === 'md';
        if (file.size === 0 || file.size > (textFile ? 2 : 10) * 1024 * 1024) {errors.push(`${file.name}：文件为空或超出大小限制`); continue;}
        if (resources.some(item => item.name === file.name && item.size === file.size) || accepted.some(item => item.name === file.name && item.size === file.size)) {errors.push(`${file.name}：已选择同名同大小文件`); continue;}
        try {
          const text = textFile ? await file.text() : undefined;
          if (textFile && !text?.trim()) {errors.push(`${file.name}：没有可预览的文字`); continue;}
          accepted.push({id: `resource-${Date.now()}-${accepted.length}`, name: file.name, size: file.size, text, status: textFile ? 'local' : 'needs-parser'});
        } catch {errors.push(`${file.name}：读取失败，请重新选择`);}
      }
      addResources(accepted);
      setNotice([accepted.length ? `已在当前标签页选择 ${accepted.length} 个文件，没有上传。` : '', ...errors].filter(Boolean).join(' '));
    } finally {setBusy(false);}
  }
  return <Layout title="学习资料库" description="本地选择和预览学习资料，准备有来源的学习问题。">
    <main className={styles.workspace} data-online-workspace>
      <div className={styles.topline}><span>CONVERGE / LEARNING MATERIALS</span><span className={styles.status}>本地选择 · 不上传</span></div>
      <div className={styles.heading}><div><p className={styles.eyebrow}>让学习有据可循</p><h1>你的资料<br /><span>你的学习起点</span></h1></div><p>把教材、讲义与笔记放在一起。<br />从一段原文开始，准备更具体的问题。</p></div>
      <section className={styles.resourceToolbar} aria-label="资料操作"><div><h2>本次选择的资料 <span>{resources.length.toString().padStart(2, '0')}</span></h2><p>刷新页面后清空。文本仅在浏览器内读取，不写入服务器。</p></div><input ref={fileInput} className={styles.srOnly} type="file" multiple accept=".txt,.md,.pdf,.docx" onChange={chooseFiles} aria-label="选择学习资料文件" disabled={busy} /><Button onClick={() => fileInput.current?.click()} isLoading={busy}>选择本地文件 <span aria-hidden="true">＋</span></Button></section>
      <div className={styles.resourceLayout}>
        <section className={styles.panel} aria-label="资料列表">
          <label className={styles.inputLabel} htmlFor="resource-filter">查找已选文件</label><input id="resource-filter" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="文件名或文本内容（本地文字匹配，非 RAG）" />
          <p role="status" className={styles.notice}>{busy ? '正在浏览器内读取…' : notice}</p>
          {visible.length === 0 ? <div className={styles.empty}><span aria-hidden="true">↗</span><h3>{resources.length ? '没有匹配的资料' : '从一份学习资料开始'}</h3><p>TXT / Markdown：可本地预览，单个不超过 2 MB<br />PDF / DOCX：仅登记文件信息，单个不超过 10 MB<br />最多 20 个文件，不进行上传或知识库索引</p></div> : <ul className={styles.resourceList}>{visible.map(item => <li key={item.id}><span className={styles.fileBadge}>{item.name.split('.').pop()?.toUpperCase()}</span><div><strong>{item.name}</strong><small>{(item.size / 1024).toFixed(1)} KB · {item.status === 'local' ? '文字可预览 · 未上传' : '待接入解析 · 未上传'}</small></div><button type="button" onClick={() => setPreviewId(item.id)} aria-label={`查看 ${item.name}`}>查看</button><button type="button" onClick={() => {removeResource(item.id); setNotice(`已从本次选择中移除 ${item.name}，原文件未删除。`);}} aria-label={`移除 ${item.name}`}>移除</button></li>)}</ul>}
          <div className={styles.boundary}>后端接入前，不提供语义检索、模型分析和引用生成。扫描文档与 OCR 不在当前可用范围内。</div>
        </section>
        <aside className={styles.preview} aria-labelledby="material-preview-title"><span className={styles.label}>SOURCE / PREVIEW</span><h2 id="material-preview-title">{preview ? preview.name : '原文在这里'}</h2>{preview?.text ? <pre>{preview.text.slice(0, 20000)}{preview.text.length > 20000 ? '\n\n（仅预览前 20,000 字符）' : ''}</pre> : <p>{preview ? '此文件需要后端解析。当前只保留名称与大小，尚未读取正文，也没有上传。' : '选择一份文字资料后点“查看”，即可阅读本地原文。这里不会展示虚构的检索片段或引用。'}</p>}<Link to="/learn">带着问题开始学习 →</Link></aside>
      </div>
      <footer className={styles.workspaceFoot}><span>资料是依据，不是自动生成的答案</span><Link to="/docs/tutorials/import-knowledge">桌面端导入教程 →</Link></footer>
    </main>
  </Layout>;
}
