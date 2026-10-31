import {useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import {registrationService, registerAndContinue, RegistrationNotConfiguredError} from '../services/auth/registration-service';
import styles from './register.module.css';

export default function Register(): ReactNode {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit() {
    if (busy) return;
    setError('');
    if (password !== confirmation) {setError('两次输入的密码不一致'); return;}
    setBusy(true);
    try {
      await registerAndContinue(registrationService, {username: username.trim(), password}, () => history.push('/login?registered=1'));
    }
    catch (cause) {setError(cause instanceof RegistrationNotConfiguredError ? '注册服务暂未开放，请稍后再试。' : '暂时无法注册，请稍后重试。');}
    finally {setBusy(false); setPassword(''); setConfirmation(''); setVisible(false);}
  }
  return <Layout title="注册" description="创建 Converge 账号，开启你的学习旅程。">
    <main className={styles.page} data-online-workspace>
      <section className={styles.story} aria-labelledby="register-heading"><p className={styles.eyebrow}>CONVERGE / A NEW BEGINNING</p><h1 id="register-heading">从好奇出发<br /><span>开启新的理解</span></h1><p className={styles.lead}>把问题、思考与学习资料连接起来<br />为每一次探索，留下继续的起点</p><div className={styles.diagram} aria-hidden="true"><span>好奇</span><i /><span>探索</span><i /><span>理解</span></div><Link to="/">← 返回首页</Link></section>
      <section className={styles.card} aria-labelledby="account-heading"><span className={styles.number}>01 / CREATE ACCOUNT</span><h2 id="account-heading">创建账号</h2><p className={styles.intro}>开启你的 Converge 学习空间</p>
        <form onSubmit={event => {event.preventDefault(); void submit();}}>
          <label htmlFor="register-username">用户名</label><input id="register-username" name="username" autoComplete="username" required maxLength={64} value={username} onChange={event => setUsername(event.target.value)} placeholder="设置用户名" disabled={busy} />
          <label htmlFor="register-password">密码</label><div className={styles.password}><input id="register-password" name="password" type={visible ? 'text' : 'password'} autoComplete="new-password" required maxLength={256} value={password} onChange={event => setPassword(event.target.value)} placeholder="设置密码" disabled={busy} /><button type="button" onClick={() => setVisible(value => !value)} aria-label={visible ? '隐藏密码' : '显示密码'} aria-pressed={visible}>{visible ? '隐藏' : '显示'}</button></div>
          <label htmlFor="register-confirmation">确认密码</label><input id="register-confirmation" name="confirmation" type={visible ? 'text' : 'password'} autoComplete="new-password" required maxLength={256} value={confirmation} onChange={event => setConfirmation(event.target.value)} placeholder="再次输入密码" disabled={busy} aria-describedby={error ? 'register-error' : undefined} />
          <p id="register-error" role="alert" className={styles.error}>{error}</p><button className={styles.submit} type="submit" disabled={busy || !username.trim() || !password || !confirmation}>{busy ? '正在提交…' : '创建账号'}<span aria-hidden="true">↗</span></button>
        </form><div className={styles.bottom}><Link to="/login">已有账号？去登录 →</Link><Link to="/docs">使用帮助</Link></div>
      </section>
    </main>
  </Layout>;
}
