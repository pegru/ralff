import {render, screen} from '@testing-library/react';
import HtmlLf from './html-lf';
import {BrowserRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const onSubmit = jest.fn();
describe('LoginForm2', () => {
  beforeEach(() => {
    onSubmit.mockImplementation(event => {
      event.preventDefault();
    });

    render(
      <BrowserRouter>
        <HtmlLf onSubmit={onSubmit}/>
      </BrowserRouter>
    )
  });

  it('invalid', async () => {
    expect(await screen.findByLabelText('Email')).toHaveValue('');
    // trigger validation
    await userEvent.click(await screen.findByRole('button', {name: 'Submit'}));
    expect(onSubmit).toHaveBeenCalled();
    // check if invalid set
    expect(await screen.findByLabelText('Email')).toBeInvalid();
    // enter valid input
    await userEvent.type(await screen.findByLabelText('Email'), 'user');
    expect(await screen.findByLabelText('Email')).toBeValid();
  });
})