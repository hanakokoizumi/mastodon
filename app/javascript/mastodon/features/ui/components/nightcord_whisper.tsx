import { useState } from 'react';
import type { FC } from 'react';

import classes from './nightcord_whisper.module.scss';

// Fixed Japanese lines — always shown as-is, regardless of UI locale.
const WHISPERS = [
  '25時、ナイトコードで。',
  '……聞こえてる？',
  '今夜も、ここにいるよ。',
  'まだ、誰も寝てないみたい。',
  '静かな部屋に、声だけが残る。',
  '曲は、まだ途中だね。',
  'また、25時に。',
  '画面の向こうで、待ってる。',
  '名前はいらない。声だけでいい。',
  '終わらない会話を、少しだけ。',
  '夜が深いほど、言葉は短くなる。',
  '回線の向こうに、息づかいが。',
  '……作業、続ける？',
  '誰かの気配が、まだ残ってる。',
  'ひとりじゃない夜だよ。',
  'セカイは、静かすぎるね。',
  '送った。聞いてみて。',
  '今日は、残しておくね。',
  '夜明け前まで、あと少し。',
  'また会おう。25時に。',
] as const;

export const NightcordWhisper: FC = () => {
  const [line] = useState(
    () => WHISPERS[Math.floor(Math.random() * WHISPERS.length)] ?? WHISPERS[0],
  );

  return (
    <p className={classes.whisper} lang='ja' dir='auto'>
      {line}
    </p>
  );
};
