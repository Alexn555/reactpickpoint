import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { restartGame } from '../actions/game-actions';
import '../components/points/points.scss';
import { Letters } from '../components/letters/letters-table';

import SoundManager from '../utils/soundmanager';

class PoinsPage extends Component {

   restartSound;
   bonusSound;
   disabledSound;
   soundManager;
   
   state = {
 	   picks: [],
       lastPickedLetter: '',
       restart: false,
       bonuses: 0,
       total: 0
   }

   componentDidMount() {
	   this.soundManager = new SoundManager();
	   this.restartSound = this.soundManager.importSound('restart');
	   this.bonusSound = this.soundManager.importSound('bonus');
   }

   componentDidUpdate(prevProps, nextProps){
       if (!this.state.restart) {
           if (this.props.letter.letter !== this.state.lastPickedLetter) {
               const newPickedLetter = this.props.letter.letter;
               let picks = this.state.picks;
               const updPicks = this.findFromPicked(newPickedLetter, picks);
               if (!updPicks) {
                   const pickedItem = this.getPickData(newPickedLetter);
                   picks.push(pickedItem);
               } else {
                   picks = updPicks;
               }
               this.setState({
                   picks: picks,
                   lastPickedLetter: newPickedLetter
               });
           }
       }
   }

   addToTotal(addValue) {
       let newTotal = this.state.total + addValue;
       this.setState({
           total: newTotal
       });
   }

   addToBonuses(addValue) {
       let newBonuses = this.state.bonuses + addValue;
       this.setState({
           bonuses: newBonuses
       });
	   if (addValue > 0) {
		   this.soundManager.playBonus();
	   }
   }

   getPickData(letter) {
       if(!letter) return false;
       for(let letterObj of Letters) {
           if (letter === letterObj.letter){
               let resLetterObj;
               resLetterObj = letterObj;
               this.addToTotal(resLetterObj.normal.points);
               resLetterObj['qty'] = 1;
               resLetterObj['points'] = resLetterObj.normal.points;
               return resLetterObj;
           }
       }
   }

   findFromPicked(letter, currentPicks) {
       for(let i = 0; i < currentPicks.length; i++) {
           if (letter === currentPicks[i].letter){
               currentPicks[i].qty += 1;
               const pointsToAdd = this.getPointsFromLetter(letter, currentPicks[i].qty);
               currentPicks[i].points += pointsToAdd;
               this.addToTotal(pointsToAdd);
               return currentPicks;
           }
       }
       return false;
   }

   getPointsFromLetter(letter, qty) {
       const clearLetters = [ ...Letters ];
       for(let letterObj of clearLetters) {
           if (letter === letterObj.letter) {
               const safeCopy = Object.assign({}, letterObj);
               const bonus = this.checkAddBonus(safeCopy.bonus, qty);
               const usualPoints = this.checkAddPoints(safeCopy.normal);
               const points = usualPoints + bonus;
               this.addToBonuses(bonus);
               return points;
           }
       }
       return 0;
   }

    checkAddPoints(letterObj, qty) {
        let points = 0;
        if (letterObj.points > 0) {
            points = letterObj.points;
        }
        return points;
    }

   checkAddBonus(bonusObj, qty) {
       let bonus = 0;
       if (bonusObj.triggerCount > 0 && qty % bonusObj.triggerCount === 0) {
           bonus = bonusObj.points;
       }
       return bonus;
   }

   onRestartGameClick(e) {
        e.preventDefault();
		this.soundManager.playRestart();
		this.props.restartGame(true);
		this.resetFields();
		this.setState({ restart: true });
		setTimeout(() => {
            this.setState({
                restart: false
            });
			this.props.restartGame(false);
        }, 700);
        return false;
   }

   resetFields() {
       this.setState({
           picks: [],
           bonuses: 0,
		   restart: false,
           total: 0
       });
   }
  
   showPickedLettersList(){
		const picks = this.state.picks;
		if (typeof picks === 'undefined' || picks.length <= 0) {
		    return (<div></div>);
        }
        let list = []
        let children = [];

        let i = 0;
        for (let pick of picks) {
            i++;
            children.push(
                <li key={`picks-${i}`} className='picks-item'>
                       <span> Letter: {`"${pick.letter}"`} </span> |
                       <span> qty: {`${pick.qty}`} </span> |
                       <span> points: {`${pick.points}`} </span>
                </li>);
        }
        list.push(<ul key="picks-list" className="picks-list">{children}</ul>)
        return list;
   }

   render() {
	  this.audioRef = React.createRef();  
	  return (
		  <div>
		   <Container>
		    <Row>
               <Col className="points-container"> Player items </Col>
           </Row>
           <Row>
               <Col className="points-container">
                   {this.showPickedLettersList()}
               </Col>
           </Row>

            <Row>
               <Col md="7" className="points-container"> Bonus: </Col>
               <Col md="5" className="points-container"> {this.state.bonuses} </Col>
            </Row>

			<Row>
			  <Col md="7" className="points-total"> Total: {this.state.total} </Col>
			  <Col md="5" className="points-container">
                  <Button variant="outline-info" value="Restart"
                          onClick={(e) => { this.onRestartGameClick(e) }}> Restart </Button>
              </Col>
		    </Row>
		   </Container>
		   <audio ref={this.audioRef} src={this.restartSound}/>
			<audio ref={this.audioRef} src={this.bonusSound}/>
		  </div>
	 );
   }

}

// Make contacts  array available in  props
function mapStateToProps(state) {
  return {
      letter : state.gameStore.letter,
	  restart: state.gameStore.restart
  }
}

export default connect(mapStateToProps, {restartGame})(PoinsPage);
