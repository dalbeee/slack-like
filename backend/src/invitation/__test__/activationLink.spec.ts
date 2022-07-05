import { v4 as uuid } from 'uuid';
import * as dayjs from 'dayjs';

it('', async () => {
  const uid = dayjs().unix() + '__' + uuid();
  console.log(encodeURIComponent(uid));
});
