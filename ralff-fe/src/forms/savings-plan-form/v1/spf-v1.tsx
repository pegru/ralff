import {FormProvider, useForm} from 'react-hook-form';
import {SavingsFormDto} from '../types/savings-form-dto';
import {useNavigate} from "react-router-dom";
import {FormContainer} from "../../../components/form-container.tsx";
import {Title} from "../components/title.tsx";
import {StartEndDate} from "../components/dates/start-end-date.tsx";
import {MonthlySavings} from "../components/monthly-savings.tsx";
import {Generate} from "../components/generate.tsx";
import {SavingsSummary} from "../components/savings-summary.tsx";
import {FooterWrapper} from "../components/footer-wrapper.tsx";
import {useToast} from "../../../components/toast/use-toast.ts";
import {SavingsTable} from "../components/table/savings-table.tsx";

const defaultValuesUnfilled: SavingsFormDto = {
  title: '',
  startDate: null,
  endDate: null,
  monthlySavings: 0,
  savings: []
}
// @ts-ignore
const defaultValuesFilled: SavingsFormDto = {
  title: 'Title',
  startDate: new Date('10/11/2023'),
  endDate: new Date('11/12/2023'),
  monthlySavings: 150,
  savings: []
}

function SpfV1() {
  const navigate = useNavigate();
  const showToast = useToast();

  const defaultValues = defaultValuesUnfilled;

  const formMethods = useForm<SavingsFormDto>({
    defaultValues,
    mode: 'onBlur'
  });
  const {handleSubmit, reset} = formMethods;

  const onSubmit = (data: SavingsFormDto) => {
    console.log(data);
    showToast({message: 'Submit successful.', type: 'success'});
    navigate('/');
  }

  return (
    <FormProvider {...formMethods}>
      <form noValidate onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
        <FormContainer title='Saving Plan'>
          <Title/>
          <StartEndDate/>
          <MonthlySavings/>
          <Generate/>
          <SavingsTable mode='normal'/>
          <SavingsSummary/>
          <FooterWrapper/>
        </FormContainer>
      </form>
    </FormProvider>
  );
}

export default SpfV1;