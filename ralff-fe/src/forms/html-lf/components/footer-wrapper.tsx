import React from 'react';
import {useFormState} from "react-hook-form";
import SubmitFooter from "../../../components/submit-footer";

const FooterWrapper = () => {
  const {isValid} = useFormState();
  return (
    <SubmitFooter disabled={!isValid}/>
  );
};

export default FooterWrapper;