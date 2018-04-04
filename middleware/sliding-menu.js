import { UI_CLOSE_SLIDING_MENU } from '@/store/mutation-types';

export default function (context) {
  context.app.store.commit(UI_CLOSE_SLIDING_MENU);
}
