import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Button} from '../components';
import {PageHero, SectionHeading} from '../components/SitePrimitives';
import styles from './community.module.css';

const projectUrl = 'https://github.com/baibinggyu/Multi-Agent';

export default function Community(): ReactNode {
  return (
    <Layout title="社区与贡献" description="通过项目仓库了解 Converge、报告问题并参与贡献。">
      <main className={styles.communityPage}>
        <PageHero eyebrow="COMMUNITY / BUILD IN THE OPEN" title="好的教学工具，需要一起打磨。" description="从复现一个问题、补充一条教程，到改进教学策略。Converge 的下一步，来自真实的使用反馈。" actions={<><Button to={projectUrl} target="_blank" rel="noreferrer" size="large">访问项目 GitHub</Button><Button to="/docs" variant="secondary" size="large">阅读文档</Button></>} aside={<div className={styles.communityMark}><span>CONVERGE</span><strong>LEARN<br />TOGETHER.</strong><i>OPEN PROJECT / EDUCATION AGENTS</i></div>} />
        <section className={styles.contributeSection}>
          <SectionHeading index="01" eyebrow="Ways to contribute" title="从小处开始，帮助系统变得更清楚。" description="当前不展示虚构的用户数量、插件生态或社区活动。可参与的方式以实际仓库状态为准。" />
          <div className={styles.contributeGrid}><a href={`${projectUrl}/issues`} target="_blank" rel="noreferrer"><span>01 / REPORT</span><strong>提交问题</strong><p>提供复现步骤、运行环境和相关日志，帮助定位问题。</p><i>↗</i></a><a href={`${projectUrl}/tree/main/converge-skills`} target="_blank" rel="noreferrer"><span>02 / TEACHING</span><strong>改进教学策略</strong><p>一起审阅 Skills 的适用场景、边界和教学流程。</p><i>↗</i></a><Link to="/docs" className={styles.contributeLink}><span>03 / DOCUMENT</span><strong>补充文档</strong><p>让安装、配置和使用过程对新成员更友好。</p><i>↗</i></Link></div>
        </section>
        <section className={styles.communityCta}><SectionHeading eyebrow="Keep exploring" title="先体验，再一起改进。" description="查看项目代码、从本地启动工作台，或沿着文档理解它的教学机制。" align="center" /><div><Button to="/download" size="large">本地运行 Converge</Button><Button to={`${projectUrl}/tree/main/converge-skills`} target="_blank" rel="noreferrer" size="large" variant="secondary">浏览 Skills 源码</Button></div></section>
      </main>
    </Layout>
  );
}
