import {useNavigate} from "react-router-dom";
import {FormProvider, useForm} from "react-hook-form";
import {SavingsFormDto} from "../types/savings-form-dto.ts";
import {TitleWithDisabled} from "../components/title.tsx";
import {StartEndDate} from "../components/dates/start-end-date.tsx";
import {MonthlySavingsWithDisabled} from "../components/monthly-savings.tsx";
import {GenerateWithDisabled} from "../components/generate.tsx";
import {SavingsTable} from "../components/table/savings-table.tsx";
import {SavingsSummary} from "../components/savings-summary.tsx";
import {FooterWrapper} from "../components/footer-wrapper.tsx";
import {FormContainer} from "../../../components/form-container.tsx";
import {useToast} from "../../../components/toast/use-toast.ts";

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
  startDate: new Date('2023-10-11'),
  endDate: new Date('2023-12-11'),
  monthlySavings: 150,
  savings: []
}

export function SpfV2() {
  const navigate = useNavigate();
  const showToast = useToast();
  const defaultValues = defaultValuesUnfilled;
  const formMethods = useForm<SavingsFormDto>({
    defaultValues,
    mode: 'onBlur'
  });

  const onSubmit = (data: SavingsFormDto) => {
    console.log(data);
    navigate('/');
    showToast({message: 'Submit successful.', type: 'success'});
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} onReset={() => formMethods.reset()} noValidate>
        <FormContainer title='Saving Plan V2'>
          <TitleWithDisabled/>
          <StartEndDate mode='disabled'/>
          <MonthlySavingsWithDisabled/>
          <GenerateWithDisabled/>
          <SavingsTable mode='disabled'/>
          <SavingsSummary/>
          <FooterWrapper/>
        </FormContainer>
      </form>
    </FormProvider>
  );
}