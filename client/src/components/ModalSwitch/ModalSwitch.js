import React from "react";
import LeaderModal from "../LeaderModal";
import HaltModal from "../HaltModal";
import CorrectModal from "../CorrectModal";

const ModalSwitch = props => {
    switch (props.currentModal) {
        case "LEADER_MODAL":
            console.log("leaderswitch");
            return <LeaderModal {...props}/>;

        case "HALT_MODAL":
            console.log("haltswitch");
            return <HaltModal {...props}/>;
        
        case "CORRECT_MODAL":
            console.log("correctswitch");
            return <CorrectModal {...props}/>;

        default:
            return null;
    }
};

export default ModalSwitch;