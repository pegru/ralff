import React, {useState} from 'react';

export interface LoginForm2Props {
  onSubmit: () => void
}

const HtmlLf = ({onSubmit}: LoginForm2Props) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const reset = (ev: React.FormEvent<HTMLFormElement>) => {
    setEmail('');
    setPassword('');
  }

  return (
    <form onSubmit={onSubmit} onReset={reset}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 50, justifySelf: 'center', width: '20%'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <label htmlFor={'email'}>Email</label>
            <input id="email"
                   name="email"
                   type="text"
                   value={email}
                   required
                   autoComplete={'email'}
                   onChange={e => setEmail(e?.target?.value)}
                   placeholder="Enter email"/>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <label htmlFor={'password'}>Password</label>
            <input id="password"
                   name="password"
                   type="password"
                   value={password}
                   required
                   autoComplete={'password'}
                   onChange={e => setPassword(e?.target?.value)}
                   placeholder="Enter Password"/>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'space-between'}}>
          <button type="button">Cancel</button>
          <button type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
};

export default HtmlLf;