import * as dayjs from 'dayjs';

it('dayjs().todDate() is Date', async () => {
  const now = dayjs().toDate();

  expect(now).toBeInstanceOf(Date);
});

it('return kst time dayjs instance', async () => {
  const date = dayjs(Date.now());
  console.log(
    'return kst time dayjs instance',
    '\n',
    date.format('YYYY-MM-DD HH:mm:ss'),
    '\n',
    date.toDate(),
  );
});

it('create specific date', async () => {
  const yesterday = dayjs(new Date('2022, 07, 05')).subtract(1, 'days');

  expect(yesterday.date()).toEqual(4);
});

it('add 7 days', async () => {
  const expiredDate = dayjs(new Date('2022,07,05')).add(7, 'days');

  expect(expiredDate.date()).toEqual(5 + 7);
});
