import React from 'react';

const DEFAULT_AUDIO = new Audio();

export const SoundContext = React.createContext<
  [HTMLAudioElement, React.Dispatch<React.SetStateAction<HTMLAudioElement>>]
>([DEFAULT_AUDIO, () => {}]);

export const SoundProvider: React.FC = ({ children }) => {
  const [audio, setAudio] = React.useState(DEFAULT_AUDIO);

  return (
    <SoundContext.Provider value={[audio, setAudio]}>
      {children}
    </SoundContext.Provider>
  );
};
