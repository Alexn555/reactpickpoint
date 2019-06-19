import pointSound from '../assets/sounds/point.wav';
import restartSound from '../assets/sounds/restart.wav';
import bonusSound from '../assets/sounds/bonus.wav';

let soundsOn = true;

export default class SoundManager {
	   
   importSound(soundName){
	   switch(soundName) {
		 case 'point': 
			return pointSound;
		 case 'bonus':
			return bonusSound;
		 case 'restart': 
		 default:
		 return restartSound;
	   }
	   return restartSound;
   }
   
   
   toggleVolume(){
	   soundsOn = !soundsOn;
   }
   
   getVolume() {
	   return soundsOn;
   }
	
   playPoint(){
	   this.playSound(pointSound);
	}
	
	playBonus(){
		this.playSound(bonusSound);
	}
	
	playRestart(){
		this.playSound(restartSound);
	}
	
	playSound(sound) {
		if (!soundsOn) { return; }
		let audio = new Audio(sound);
		audio.play();
	}

}