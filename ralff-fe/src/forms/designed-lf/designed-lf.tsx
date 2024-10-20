import {FormProvider, useForm} from 'react-hook-form';
import {LoginFormDto} from './model/login-form-dto';
import {useNavigate} from 'react-router-dom';
import {Username} from "./components/username.tsx";
import {Password} from "./components/password.tsx";
import FooterWrapper from "./components/footer-wrapper.tsx";
import {URL_HOME} from "../../utils/constants.ts";
import {FormContainer} from "../../components/form-container.tsx";
import {useToast} from "../../components/toast/use-toast.ts";

export const DesignedLf = () => {
  const navigate = useNavigate();
  const showToast = useToast();

  const initialFormValues: LoginFormDto = {
    username: '',
    password: ''
  }

  const formMethods = useForm<LoginFormDto>({
    defaultValues: initialFormValues,
    mode: 'onChange'
  });


  const {
    handleSubmit,
    reset
  } = formMethods;

  const onSubmit = (data: LoginFormDto) => {
    console.log(data);
    showToast({message: 'Login successful.', type: 'success'});
    navigate(URL_HOME);
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
        <FormContainer title='Login Form'>
          <Username/>
          <Password/>
          <FooterWrapper/>
        </FormContainer>
      </form>
    </FormProvider>

  );
}