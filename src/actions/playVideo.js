import * as types from '../constants/ActionTypes'

export function playVideo(video) {
  return {
    type: types.PLAY_VIDEO,
    video
  };
}
