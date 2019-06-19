
export function newPoint(selectedLetter = 'A'){
  return dispatch => {
    dispatch({
      type: 'NEW_POINT',
      payload: { 'letter': selectedLetter }
    })
  }
}

export function restartGame(isRestart){
  return dispatch => {
    dispatch({
      type: 'RESTART_GAME',
      payload: { 'restart': isRestart }
	  })
  }
}