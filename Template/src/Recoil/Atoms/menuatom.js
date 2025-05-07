import { atom } from 'recoil';

export const selectedMenuAtom = atom({
  key: 'selectedMenuAtom',
  default: 'todolist', // 기본 값
});
