import axios from "axios";

export function fetchVideos() {
  //lilox:TODO - restUrl 
  var restUrl = 'http://localhost:3000/api/videos';
  return function(dispatch) {
    axios.get(restUrl)
      .then((response) => {
        dispatch({type: "FETCH_VIDEOS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "FETCH_VIDEOS_REJECTED", payload: err})
      })
  }
}
