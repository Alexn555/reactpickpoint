import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { Message, Icon } from 'semantic-ui-react';
import { newPoint } from '../actions/game-actions';
import '../components/letters/letters.scss';
import '../components/points/points.scss';
import PoinsPage from '../pages/points-page';
import { Letters } from '../components/letters/letters-table';
import SoundManager from '../utils/soundmanager';

const LETTERS_PER_ROW = 3;

class GameMainPage extends Component {

   pointSound;
   soundManager;
   state = {
      activePick: '',
	  restart: false,
	  soundOn: true
   };

   componentDidMount() {
	  this.soundManager = new SoundManager();
	  this.pointSound = this.soundManager.importSound('point');
   }
  
    componentDidUpdate(prevProps, nextProps){
       if (!this.state.restart) {
           if (this.props.restart && this.props.restart !== this.state.restart) {
               this.setState({ restart: true });
			   setTimeout(() => {
				  this.setState({ restart: false});
			   }, 1000);
           }
       }
   }

   onLetterClick(e, letterValue) {
        e.preventDefault();
        this.setState({
            activePick: letterValue
        });
		this.soundManager.playPoint();
		this.props.newPoint(letterValue);
        return false;
   }

   showLetters(){
		const size = Letters.length;
        let list = []
        let children = [];

        for (let i = 0; i < size; i++) {
            let className = i === this.state.activePick ? 'letters-item-active' : 'letters-item';
            if (i % LETTERS_PER_ROW == 0) {
                 children.push('  ...... ');
            }
            children.push(
                <li key={`letter-${i}`} className={className}
                    onClick={(e) => this.onLetterClick(e, Letters[i].letter)}>
                       {`${Letters[i].letter}`}</li>)
        }
        list.push(<ul key="letter-list" className="letters">{children}</ul>)
        return list;
   }
   
   showRestartMessage() {
	  if (this.state.restart) {
        return (<Message icon info>
			<Icon name='circle' />
			<Message.Content>
			   <Message.Header>Game has restarted</Message.Header>
			   <p>Good luck!</p>
		   </Message.Content>
		  </Message>);
	  } 
	  return (<div></div>); 
   }

   render() {
	  this.audioRef = React.createRef();  
	  return (
		  <div>
		   <Container>
		    <Row>
			  <Col md="8" className="letters-container">{this.showLetters()}</Col>
			  <Col md="4" className="points-wrapper">
                <PoinsPage/>
              </Col>
		    </Row>
		   </Container>
		   {this.showRestartMessage()}
			<audio ref={this.audioRef} src={this.pointSound} autoPlay/>
		  </div>
	 );
   }

}

// Make contacts  array available in  props
function mapStateToProps(state) {
  return {
	  letter : state.gameStore.letter,
      restart : state.gameStore.restart,
  }
}

export default connect(mapStateToProps, {newPoint})(GameMainPage);
