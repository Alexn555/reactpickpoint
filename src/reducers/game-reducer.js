const defaultState = {
  letter: {},
  restart: false
};

export default (state=defaultState, action={}) => {
  switch (action.type) {
	case 'NEW_POINT': {
      return {
        ...state,
        letter: { letter: action.payload.letter }
      }
    }
	
	case 'RESTART_GAME': {
      return {
        ...state,
        restart: action.payload.restart
      }
    }

    default:
      return state;
  }
}
