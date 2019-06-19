import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import { Container, Icon } from 'semantic-ui-react';
import GameMainPage from './pages/game-main-page';
import SoundManager from './utils/soundmanager';

class App extends Component {
   state = {
	   volume: true
   }
	
   componentDidMount() {
	  this.soundManager = new SoundManager();
   }
  
	onVolumeClick(e) {
		this.soundManager.toggleVolume();
		const newVolume = this.soundManager.getVolume();
		this.setState({
			volume:  newVolume
		});
	}
	
	showVolumeIcon () {
		if (this.state.volume) {
			return (<Icon name='volume down' />);
		}
		return (<Icon name='volume off' />);
	}
	
    render() {
      return (
          <Container>
            <div className="ui two item menu">
              <NavLink className="item" activeClassName="active" exact to="/">Point picks</NavLink>
			  <div className="volume" onClick={(e) => this.onVolumeClick(e)}>
				  {this.showVolumeIcon()}
			  </div>
            </div>
            <Route exact path="/" component={GameMainPage}/>
          </Container>
      );
   }
}

export default App;
