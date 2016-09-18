import React  from 'react';
import Challenge from './challenge.jsx';
import AddChallenge from './addChallenge.jsx';

class Challenges extends React.Component {
    constructor(props) {
        super(props);
        this.addChallenge = this.addChallenge.bind(this);
    }

    addChallenge() {
        window.socket.emit('addChallenge', (challenge, err)=> {
            if (err) {
                console.log(err);
                return;
            }
            this.props.onChallengeAdded(challenge);
        })
    }
    render() {
        let challenges = this.props.challenges.map((challenge)=> {
            return (
                <Challenge key={challenge._id} {...challenge}/>
            );
        });

        challenges.push(<AddChallenge key="addChallenge" addChallenge={this.addChallenge} />);

        return (
            <ul>
                {challenges}
            </ul>
        );
    }
}

export default Challenges;