import {useFormState, useWatch} from 'react-hook-form';
import {SavingsDto} from "../types/savings-dto.ts";
import {FORM_SAVINGS} from "../../../utils/constants.ts";
import {SubmitFooter} from "../../../components/submit-footer.tsx";

export const FooterWrapper = () => {
  const savingFields: SavingsDto[] = useWatch({name: FORM_SAVINGS}) as SavingsDto[];
  const {errors} = useFormState();
  return (
    <SubmitFooter disabled={Object.keys(errors).length !== 0 || !savingFields || savingFields.length === 0}/>
  )
};