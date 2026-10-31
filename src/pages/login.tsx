import {useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {authService, AuthNotConfiguredError} from '../services/auth/auth-service';
import styles from './register.module.css';

export default function Login(): ReactNode {
  const location = useLocation();
  const registered = new URLSearchParams(location.search).get('registered') === '1';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit() {
    if (busy) return;
    setError(''); setBusy(true);
    try {await authService.login({username: username.trim(), password});}
    catch (cause) {setError(cause instanceof AuthNotConfiguredError ? '登录服务暂未开放，请稍后再试。' : '暂时无法登录，请稍后重试。');}
    finally {setBusy(false); setPassword(''); setVisible(false);}
  }
  return <Layout title="登录" description="登录 Converge，继续你的学习旅程。">
    <main className={styles.page} data-online-workspace>
      <section className={styles.story} aria-labelledby="login-heading"><p className={styles.eyebrow}>CONVERGE / YOUR LEARNING SPACE</p><h1 id="login-heading">每一次思考<br /><span>都值得继续</span></h1><p className={styles.lead}>从问题出发，在资料中寻找依据<br />让不同学科的学习，在这里连接</p><div className={styles.diagram} aria-hidden="true"><span>问题</span><i /><span>依据</span><i /><span>理解</span></div><Link to="/">← 返回首页</Link></section>
      <section className={styles.card} aria-labelledby="account-heading"><span className={styles.number}>01 / ACCOUNT</span><h2 id="account-heading">欢迎回来</h2><p className={styles.intro}>{registered ? '请使用刚创建的账号登录' : '登录你的 Converge 学习空间'}</p>
        <form onSubmit={event => {event.preventDefault(); void submit();}}>
          <label htmlFor="login-username">用户名</label><input id="login-username" name="username" autoComplete="username" required maxLength={64} value={username} onChange={event => setUsername(event.target.value)} placeholder="输入用户名" disabled={busy} />
          <label htmlFor="login-password">密码</label><div className={styles.password}><input id="login-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" required maxLength={256} value={password} onChange={event => setPassword(event.target.value)} placeholder="输入密码" disabled={busy} /><button type="button" onClick={() => setVisible(value => !value)} aria-label={visible ? '隐藏密码' : '显示密码'} aria-pressed={visible}>{visible ? '隐藏' : '显示'}</button></div>
          <p role="alert" className={styles.error}>{error}</p><button className={styles.submit} type="submit" disabled={busy || !username.trim() || !password}>{busy ? '正在登录…' : '登录'}<span aria-hidden="true">↗</span></button>
        </form><div className={styles.bottom}><Link to="/register">还没有账号？创建账号 →</Link><Link to="/docs">使用帮助</Link></div>
      </section>
    </main>
  </Layout>;
}
