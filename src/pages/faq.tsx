import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {PageHero} from '../components/SitePrimitives';
import styles from './faq.module.css';

const questions = [
  {category: 'PRODUCT', question: 'Converge 是聊天机器人吗？', answer: 'Converge 是面向编程教育的教学认知状态工作台。它关注学习者的掌握度、知识缺口与错误证据，并将这些信息用于选择下一步教学动作；对话只是其中一种交互方式。'},
  {category: 'PRODUCT', question: 'Converge 如何使用 Multi-Agent？', answer: '项目将 Agent 与任务编排、教学状态和工具使用结合。每个 Agent 的目标应服务于学习流程，而不是为了展示 Agent 数量。具体实现细节以项目代码与软件手册为准。'},
  {category: 'LEARNING STATE', question: 'Memory 和教学认知状态有什么不同？', answer: 'Memory 保存较长期的学习者信息，例如偏好、目标或约束；教学认知状态描述对某个知识点当前掌握到哪里、有什么误解，以及这一判断有哪些证据。'},
  {category: 'KNOWLEDGE', question: 'RAG、Wiki 和 Skills 分别做什么？', answer: 'RAG 在资料中检索相关内容；Wiki 组织可编辑的知识页面与关系；Skills 保存可复用的任务或教学策略。它们可以共同为 Agent 提供上下文，但职责并不相同。'},
  {category: 'TOOLS', question: '可以连接 MCP 服务吗？', answer: '项目包含 MCP 使用教程。接入时请只添加可信服务，并仔细检查文件写入、终端等具有副作用的工具权限。'},
  {category: 'SETUP', question: '我可以直接下载已编译的安装包吗？', answer: '目前官网没有发布经过确认的预编译安装包。请通过项目源码按快速开始文档在本地运行；官网不会展示虚构版本或下载链接。'},
  {category: 'ACCOUNT', question: '官网支持账号登录吗？', answer: '当前官网没有登录入口，也没有实现真实账号系统或鉴权。官网服务层里的 Auth/Mock 类型不是可用的线上登录功能。'},
  {category: 'DATA', question: '会把我的学习数据上传到云端吗？', answer: '项目资料描述了本地持久化路径和 SQLite 数据。实际使用前请阅读仓库中的数据边界与配置说明；不要把 API Key 或本地运行数据提交到 Git。'},
];

export default function FAQ(): ReactNode {
  return (
    <Layout title="常见问题" description="关于 Converge 产品定位、学习状态、知识工具、安装与数据的常见问题。">
      <main className={styles.faqPage}>
        <PageHero eyebrow="FAQ / QUICK ANSWERS" title="先把几个概念说清楚。" description="产品定位、学习状态、工具与本地运行方式。找不到答案时，欢迎到项目仓库提出问题。" />
        <section className={styles.faqContent}>
          <nav className={styles.faqIndex} aria-label="FAQ 分类"><a href="#product">产品</a><a href="#learning-state">学习状态</a><a href="#knowledge">知识与工具</a><a href="#setup">安装与账户</a><a href="#data">数据</a></nav>
          <div className={styles.faqList}>
            {questions.map((item, index) => <details className={styles.faqItem} id={index === 0 ? 'product' : index === 2 ? 'learning-state' : index === 3 ? 'knowledge' : index === 5 ? 'setup' : index === 7 ? 'data' : undefined} key={item.question}>
              <summary><span>{item.category}</span><strong>{item.question}</strong><i aria-hidden="true">+</i></summary>
              <p>{item.answer}</p>
            </details>)}
          </div>
        </section>
        <section className={styles.faqMore}><div><span>STILL CURIOUS?</span><h2>继续从手册深入。</h2></div><p>文档包含快速开始、软件手册、MCP、Wiki、Memory、RAG 和 Skills 教程。</p><Link to="/docs">打开文档 →</Link></section>
      </main>
    </Layout>
  );
}
