import {makeProject} from '@motion-canvas/core';

import anim from './scenes/anim?scene';

import tis_for_you from '../audio/tis_for_you.wav'

export default makeProject({
  scenes: [
    //example,
    anim,
    //test,
  ],

  audio: tis_for_you
});

/***********************************************\
*    Music track: This Is For You by Lukrembo   *
*    Source: https://freetouse.com/music        *
*    Copyright Free Music for Video             *
\***********************************************/