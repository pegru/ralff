import React, {useState} from 'react';
import {Toast} from 'monday-ui-react-core';
import {TOAST_TIMEOUT} from '../forms/constants';

interface MyToastProps {

}

export const MyToast = (props: MyToastProps) => {
  const [open, setOpen] = useState(true)

  return (
    <Toast open={open} autoHideDuration={TOAST_TIMEOUT} onClose={() => setOpen(false)}>
      Successful.
    </Toast>
  );
}