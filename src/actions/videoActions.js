import * as types from 'actions/ActionTypes'

export function playVideo(video) {
  return {
    type: types.PLAY_VIDEO,
    video
  };
}

export function stopVideo() {
  return {
    type: types.STOP_VIDEO,
    video: null
  };
}
