import "./style.css";
import React, { Component } from "react";
import Logo from "../../components/Logo";
import GuessButtons from "../../components/GuessButtons";
import GuessState from "../../components/GuessState";
import Score from "../../components/Score";
import API from "../../utils/API";
import LeaderModal from "../../components/LeaderModal/LeaderModal";
import CorrectModal from "../../components/CorrectModal/CorrectModal";
import HaltModal from "../../components/HaltModal/HaltModal";
import io from "socket.io-client";
import ModalSwitch from "../../components/ModalSwitch/ModalSwitch";

// let guess = " ";
// let score;
// let username;
// let tempboard = [];

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      guess: " ",
      username: "default",
      setModalShow: false,
      setModalHalt: false,
      setModalCorrect: false,
      leaderboard: [],
      tempboard: []
    };

    this.socket = io("localhost:3001");

    this.socket.on("RECIEVE_MESSAGE", function(data) {
      toggleModalHalt(data.setModalHalt);
      console.log("from admin: " + data.setModalHalt);
      toggleModalCorrect(data.setModalCorrect);
      console.log("from admin: " + data.setModalCorrect);
      toggleHaltOff(data.setModalHalt);
    });

    this.sendGuess = ev => {
      // ev.preventDefault();
      this.socket.emit("SEND_MESSAGE", {
        playerName: this.state.username,
        currentGuess: this.state.guess
      });
      // this.setState({guess: ''});
      // console.log(guess);
      // this.setState({})
    };

    const toggleModalHalt = (data) => {
      // console.log("this is from the admin:" + data);
      this.setState(state => {
         state.setModalHalt = data });
         console.log("**********" + this.state.setModalHalt);
    };
  
    const toggleModalCorrect = (data) => {
      this.setState(state => {
        state.setModalCorrect = data });
        console.log("//////////" + this.state.setModalCorrect);
    };
    
   const toggleHaltOff = (data) => {
     this.setState(state => {
       state.setModalHalt = data });
   } 

  }

  componentDidMount() {
   let username = this.props.match.params.username;
    this.setState({
      username: username
    });
    console.log(username);
    this.loadScore();
    this.loadLeaderboard();
    console.log(this.scoreSeed);
  }

  // Loads score and sets them to this.state.scores
  loadScore = () => {
    API.getPlayerScore(this.state.username)
      .then(res =>
        this.setState({
          score: res.data[0].currScore
        })
      )
      .catch(err => console.log(err));
  };

  loadLeaderboard = () => {
    API.getScores()
      .then(res => {
        this.state.tempboard = [];
        for (let i = 0; i < 10; i++) {
          // console.log(res.data[i]);
          this.state.tempboard.push(res.data[i]);
        }
        this.setState({ leaderboard: this.state.tempboard });
        console.log(this.state.leaderboard);
      })
      .catch(err => console.log(err));
  };

  // function that updates guess state with onClick
  // guessUpdate = (value) => {
  //     this.setState({ guess: value});
  // };

  currentModal = () => {
    if (this.state.setModalShow) {
      return "LEADER_MODAL";
    };

    if (this.state.setModalHalt) {
      return "HALT_MODAL";
    };
    
    if (this.state.setModalCorrect) {
      return "CORRECT_MODAL";
    };
  }

  toggleModal = () => {
    if (this.state.setModalShow) {
      this.setState({ setModalShow: false})
    } else {
      this.loadLeaderboard();
      this.setState({ setModalShow: true});
    }
  }

  toggleModalCorrectOff = () => {
    this.setState({ setModalCorrect: false });
  };

  // function that updates guess state with onClick
  guessUpdate = value => {
    this.setState({
      guess: value
    });
    const toSave = {
      playerName: this.state.username,
      currentGuess: value
    };
    console.log(toSave);
    console.log({
      name: this.state.username,
      guess: value
    });
    this.savePlayerGuess(toSave);
  };

  savePlayerGuess = toSave => {
    // API.updateGuess(toSave)
    API.saveScore(toSave)
      .then(res =>
        this.setState({
          score: 55 //need to change
        })
      )
      .catch(err => console.log(err));
  };

  render() {
    const sortedLeaderboard = this.state.leaderboard;
    const tableBody = sortedLeaderboard.map((player, index) => (
      <tr key={player._id}>
        <td>{index + 1} </td>
        <td>{player.playerName} </td>
        <td>{player.currScore} </td>
      </tr>
    ));
    return (

        <div>
            <Logo/>
            <Score
                user={this.state.username}
                score={this.state.score}
            />
            <GuessState
                onChange={this.sendGuess()} 
                guess={this.state.guess}
            />
            <GuessButtons
            guessUpdate={this.guessUpdate}
            toggleModalOn={this.toggleModal}
            />
            <ModalSwitch
            currentModal={this.currentModal()}
            />
            <LeaderModal
            username={this.state.username}
            score={this.state.score}
            show={this.state.setModalShow }
            leaderboard={tableBody}
            onHide={() => this.toggleModal()}
            />
            <CorrectModal
            score={this.state.score}
            show={this.state.setModalCorrect}
            onHideCorrect={() => this.toggleModalCorrectOff()}
            />
            <HaltModal 
            show={this.state.setModalHalt}
            // onHideHalt={() => this.toggleHaltOff()}
            />
      </div>
    );
  }
}

export default User;
