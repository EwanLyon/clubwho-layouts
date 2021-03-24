import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';
import styled from 'styled-components';
import { useListenFor, useReplicant } from 'use-nodecg';

import { SpotifySong } from '../../types/spotify-song';

const SpotifyContainer = styled.div`
  background: var(--main-col);
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 0;
  font-size: 30px;
  padding: 10px;
  text-align: right;
  border-left: var(--yellow) 3px solid;
  white-space: nowrap;
  text-shadow: 0px 0px 20px var(--glow);
`;

const Artist = styled.span`
  color: var(--text-secondary);
  font-size: 20px;
  text-shadow: none;
`;

interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export interface SpotifyFuncs {
  show(): void;
  hide(): void;
  togglePersistence(toggle: boolean): void;
}

export const Spotify = React.forwardRef<SpotifyFuncs, Props>((props, ref) => {
  const [currentSongRep] = useReplicant<SpotifySong, undefined>('currentSong', undefined, { namespace: 'ncg-spotify' });
  const songParent = useRef<HTMLDivElement>(null);
  const [persistent, setPersistent] = useState(false);
  const [currentSong, setCurrentSong] = useState<SpotifySong | undefined>(undefined);
  
  useListenFor('changeSpotifyPersistent', (persistent: boolean) => {
    togglePersistence(persistent);
  });

  useImperativeHandle(ref, () => ({
    show: () => {
      show();
    },
    hide: () => {
      hide();
    },
    togglePersistence(persistent: boolean) {
      togglePersistence(persistent);
    },
  }));

  useEffect(() => {
    // Change song if song names are different
    if (currentSong?.name !== currentSongRep?.name) {
      changeSong(currentSongRep);
      return;
    }

    // If the element is now persistent show
    if (persistent) {
      show();
      return;
    }

    // Show if playing, hide if paused, looks at the prop updating rather than state
    if (currentSongRep?.playing) {
      show();
    } else {
      hide();
    }
  }, [currentSong, persistent, currentSongRep]);

  function show() {
    if (!songParent?.current) return;

    gsap.to(songParent.current, {
      duration: 1,
      left: 1920 - songParent.current.offsetWidth,
      ease: 'power4.out',
    });
  }

  function hide() {
    if (!songParent?.current) return;

    gsap.to(songParent.current, {
      duration: 1,
      left: 1926,
      ease: 'power4.out',
    });
  }

  function togglePersistence(persistentToggle: boolean) {
    setPersistent(persistentToggle);
    if (persistentToggle) {
      show();
    } else {
      hide();
    }
  }

  function changeSong(nextSong: SpotifySong | undefined) {
    if (!songParent?.current) return;

    if (!nextSong) hide();

    const tl = gsap.timeline();
    tl.call(hide);
    tl.call(setCurrentSong, [nextSong], '+=1');
    tl.call(show);
  }

  return (
    <SpotifyContainer ref={songParent} className={props.className} style={props.style}>
      <span>{currentSong?.name}</span>
      <Artist>{currentSong?.artist}</Artist>
    </SpotifyContainer>
  );
});
