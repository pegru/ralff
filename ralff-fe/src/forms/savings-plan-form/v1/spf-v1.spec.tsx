import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import {BrowserRouter} from 'react-router-dom';
import SpfV1 from './spf-v1';

describe('SavingPlanForm', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SpfV1/>
      </BrowserRouter>
    );
  });

  it('title', async () => {
    expect(await screen.findByLabelText('Title*')).toHaveTextContent('');
    await userEvent.type(screen.getByLabelText('Title*'), 'Hello');
    expect(await screen.findByLabelText('Title*')).toHaveDisplayValue('Hello')
    await userEvent.clear(screen.getByLabelText('Title*'));
    expect(await screen.findByText('Enter Title')).toBeInTheDocument();
  });

  it('cancel button', async () => {
    expect(await screen.findByRole('button', {name: 'Cancel'})).toBeInTheDocument();
  });

  it('invalid start date', async () => {
    // working test nr2: more aligned what user does
    expect(screen.queryByText('Enter date')).toBeNull();
    await userEvent.click(screen.getByLabelText('Start date*'));
    await userEvent.type(screen.getByLabelText('Start date*'), '2023-10-23');
    await userEvent.type(screen.getByLabelText('Start date*'), '{Backspace}');
    fireEvent.blur(screen.getByLabelText('Start date*'));
    expect(await screen.findByText('Enter date')).toBeInTheDocument();
  });
})

