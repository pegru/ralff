import {Message, RES_STEP_MESSAGE} from '../../socket/model/message';
import {ACommand, ClickCommand, InputCommand, ResetCommand} from './a-command';
import {FirstRoleFinder, LabelFinder} from './a-finder';

export function generateSavingPlanFormCommands(): ACommand[] {
  const titleFinder = new LabelFinder('Title*');
  const a = new InputCommand('iT', titleFinder, 'title');
  const startDateFinder = new LabelFinder('Start date*');
  const b = new InputCommand('iSD', startDateFinder, '2023-11-09');
  const endDateFinder = new LabelFinder('End date*');
  const c = new InputCommand('iED', endDateFinder, '2023-12-09');
  const monthlySavingsFinder = new LabelFinder('Monthly savings*');
  const d = new InputCommand('iMS', monthlySavingsFinder, '50');

  const generateFinder = new FirstRoleFinder('button', 'Generate');
  const e = new ClickCommand('cG', generateFinder);

  const deleteFinder = new FirstRoleFinder('button', 'X');
  const f = new ClickCommand('cD', deleteFinder);

  return [
    a,
    b,
    c,
    d,
    e,
    f
  ]
}

export function generateSavingPlanForm2Commands(): ACommand[] {
  const titleFinder = new LabelFinder('Title*');
  const a = new InputCommand('iT', titleFinder, 'title');
  const a1 = new InputCommand('i2T', titleFinder, '12345678901');
  const ar = new InputCommand('icT', titleFinder, '');
  const startDateFinder = new LabelFinder('Start date*');
  const b = new InputCommand('iSD', startDateFinder, '2023-11-09');
  const br = new InputCommand('icSD', startDateFinder, '');
  const endDateFinder = new LabelFinder('End date*');
  const c = new InputCommand('iED', endDateFinder, '2023-12-09');
  const c1 = new InputCommand('i2ED', endDateFinder, '2023-10-09');
  const cr = new InputCommand('icED', endDateFinder, '');
  const monthlySavingsFinder = new LabelFinder('Monthly savings*');
  const d = new InputCommand('iMS', monthlySavingsFinder, '50');
  const d1 = new InputCommand('i2MS', monthlySavingsFinder, '5');
  const d2 = new InputCommand('i3MS', monthlySavingsFinder, '1500');
  const dr = new InputCommand('icMS', monthlySavingsFinder, '');

  const generateFinder = new FirstRoleFinder('button', 'Generate');
  const e = new ClickCommand('cG', generateFinder);

  const deleteFinder = new FirstRoleFinder('button', 'X');
  const f = new ClickCommand('cD', deleteFinder);

  return [
    a,
    a1,
    ar,
    b,
    br,
    c,
    c1,
    cr,
    d,
    d1,
    d2,
    dr,
    e,
    f
  ]
}

export function generateResetCommand(): ACommand {
  return new ResetCommand();
}

export function generateLoginForm1Commands(): ACommand[] {
  const userNameFinder = new LabelFinder('Email');
  const a = new InputCommand('iU', userNameFinder, 'test@gmail.com');
  const ar = new InputCommand('icU', userNameFinder, '');
  const passwordFinder = new LabelFinder('Password');
  const b = new InputCommand('iP', passwordFinder, 'password');
  const br = new InputCommand('icP', passwordFinder, '');
  return [
    a,
    ar,
    b,
    br
  ];
}

export function generateLoginForm2Commands(): ACommand[] {
  const userNameFinder = new LabelFinder('username');
  const a = new InputCommand('iU', userNameFinder, 'username');
  const ar = new InputCommand('icU', userNameFinder, '');
  const passwordFinder = new LabelFinder('password');
  const b = new InputCommand('iP', passwordFinder, 'password');
  const br = new InputCommand('icP', passwordFinder, '');
  return [
    a,
    ar,
    b,
    br
  ];
}

export const generateMessageForCommand = (cmd: ACommand): Message => {
  return RES_STEP_MESSAGE(cmd.symbol);
}

export const generateMessagesForAlphabet = (alphabet: string[], commandList: ACommand[]): Message[] => {
  const messages: Message[] = [];
  alphabet.forEach(a => {
    const cmd = commandList.find(c => c.symbol === a);
    if (cmd) {
      messages.push(generateMessageForCommand(cmd));
    }
  });
  return messages;
}