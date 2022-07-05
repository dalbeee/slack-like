import * as bcrypt from 'bcrypt';

it('hasing', async () => {
  const keyword = 'hello world';
  const saltRound = 10;
  const result = await bcrypt.hash(keyword, saltRound);

  expect(result).toBeDefined();
});

it('return true if success compare', async () => {
  const keyword = 'hello world';
  const saltRound = 10;
  const hash = await bcrypt.hash(keyword, saltRound);

  const result = await bcrypt.compare(keyword, hash);

  expect(result).toEqual(true);
});
