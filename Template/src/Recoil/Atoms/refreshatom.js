import { atom } from 'recoil';

export const refreshTriggerAtom = atom({
  key: 'refreshTriggerAtom',
  default: 0, //기본 값
});