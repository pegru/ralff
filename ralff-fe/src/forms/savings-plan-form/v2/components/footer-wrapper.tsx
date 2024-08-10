import React from 'react';
import {useFormState, useWatch} from 'react-hook-form';
import {SavingsDto} from '../../model/savings-dto';
import SubmitFooter from "../../../../components/submit-footer";
import {FORM_SAVINGS} from "../../../constants";

const FooterWrapper = () => {
  const savingFields: SavingsDto[] = useWatch({name: FORM_SAVINGS});
  const {errors} = useFormState();
  return (
    <SubmitFooter disabled={Object.keys(errors).length !== 0 || !savingFields || savingFields.length === 0}/>
  )
};

export default FooterWrapper;