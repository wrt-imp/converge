import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {Button} from '../components';
import {PageHero, SectionHeading, StepSequence} from '../components/SitePrimitives';
import styles from './download.module.css';

// 发布正式安装包时，填写实际下载地址并同步版本信息即可启用下载按钮。
const installerPackage: {version: string | null; platform: string; downloadUrl: string | null} = {
  version: null,
  platform: 'Windows / macOS',
  downloadUrl: null,
};

export default function Download(): ReactNode {
  return (
    <Layout title="下载与安装" description="获取 Converge 源码并在本地运行。">
      <main className={styles.downloadPage}>
        <PageHero eyebrow="DOWNLOAD / RUN IT YOURSELF" title="从源码开始，运行完整工作台。" description="当前官网不提供未经确认的预编译安装包。你可以从项目仓库获取源码，按已验证的本地流程启动 Converge。" actions={<><Button to="https://github.com/baibinggyu/Multi-Agent" target="_blank" rel="noreferrer" size="large">打开项目 GitHub</Button><Button to="/docs/getting-started/quick-start" variant="secondary" size="large">查看快速开始</Button></>} aside={<div className={styles.releaseCard}><span>RELEASE CHANNEL</span><strong>Source build</strong><p>使用仓库中的 Python、uv 与 Go 工具链在本地启动。</p><i>预编译包：尚未提供</i><div className={styles.packageSlot}><div><span>INSTALLER PACKAGE</span><b>{installerPackage.version ? `版本 ${installerPackage.version}` : '安装包准备中'}</b><small>{installerPackage.platform}</small></div>{installerPackage.downloadUrl ? <Button to={installerPackage.downloadUrl} size="small">下载安装包</Button> : <Button disabled size="small" aria-describedby="installer-status">安装包暂未开放</Button>}</div><p className={styles.packageStatus} id="installer-status">安装包下载入口已预留；正式发布后将在此提供文件与版本信息。</p></div>} />

        <section className={styles.installSection}>
          <SectionHeading index="01" eyebrow="Local setup" title="三步启动本地工作台。" description="以下命令来自当前项目快速开始文档。运行前请确认本机已安装所需工具。" />
          <StepSequence steps={['获取项目代码', '同步 Python 依赖', '启动桌面应用']} />
          <div className={styles.installCommands}><div><span>01 / CLONE</span><code>git clone https://github.com/baibinggyu/Multi-Agent.git</code></div><div><span>02 / SYNC</span><code>uv sync</code></div><div><span>03 / RUN</span><code>make run-app</code></div></div>
          <p className={styles.installNote}>需要 Python、uv 和 Go。首次启动后，按手册配置模型服务与所需工具。</p>
        </section>

        <section className={styles.downloadNotice}><div><span>NO FAKE DOWNLOADS</span><h2>准备好正式发行包后，这里会列出版本、平台和校验信息。</h2></div><p>在安装包和签名信息发布前，官网不会展示虚构的下载按钮或版本号。你可以先读 <Link to="/docs/getting-started/quick-start">快速开始</Link>，或从源码运行。</p><Link to="/docs">打开文档 →</Link></section>

        <section className={styles.downloadMore}><SectionHeading eyebrow="Before you start" title="第一次运行前，先准备好这些。" align="center" /><div><Link to="/docs/getting-started/first-launch"><b>第一次启动</b><span>了解工作区与本地数据</span>↗</Link><Link to="/docs/manual/model-configuration"><b>配置模型</b><span>连接你自己的模型服务</span>↗</Link><Link to="/docs/tutorials/use-mcp"><b>添加 MCP</b><span>扩展 Agent 的工具上下文</span>↗</Link></div></section>
      </main>
    </Layout>
  );
}
