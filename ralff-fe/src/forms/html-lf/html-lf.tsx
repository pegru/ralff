import {FormEvent, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {URL_HOME} from "../../utils/constants.ts";
import {useToast} from "../../components/toast/use-toast.ts";

export const HtmlLf = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const showToast = useToast();

  const reset = () => {
    setEmail('');
    setPassword('');
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    showToast({message: 'Login sucessfull.', type: 'success'});
    navigate(URL_HOME);
  }

  return (
    <form onSubmit={handleSubmit} onReset={() => reset()}>
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
          <button onClick={() => navigate(URL_HOME)} type="button">Cancel</button>
          <button type="submit">Submit</button>
        </div>
      </div>
    </form>
  );
};