import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Modal from 'react-bootstrap/lib/Modal';
import Label from 'react-bootstrap/lib/Label';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

import { bestPerformedAttack } from '../../../war-plan';

/**
 * WarPositionStatus label
 */
class WarPositionStatus extends React.Component {
    
    tooltip(text) {
        return <Tooltip id="tooltip">{text}</Tooltip>;
    }
    
    render() {
        if (!this.props.position) {
            return null;
        }
        
        let position = this.props.position;
        let bestAttack = bestPerformedAttack(position);
        let bestPerformedAttackTip = "";    
        let bestPerformedAttackContent = null;
        
        if (bestAttack.destructionPercentage===0) {
            bestPerformedAttackTip = "No destruction yet";
//            bestPerformedAttackContent = (<Glyphicon glyph="asterisk" />);
        } else if (bestAttack.destructionPercentage===100) {
            bestPerformedAttackTip = "Position cleared!";
            bestPerformedAttackContent = (<Glyphicon glyph="ok" />); 
        } else {
            bestPerformedAttackTip = `Best attack: ${bestAttack.destructionPercentage}%`;
            bestPerformedAttackContent = bestAttack.destructionPercentage;
        }
        
        return (
            <OverlayTrigger overlay={this.tooltip(bestPerformedAttackTip)}>
                <div className={`wps ${this.props.className||''}`}>
                    <span className={`wps-stars wps-stars-${bestAttack.stars}`} />
                    <span className={`wps-th wps-th-${bestAttack.stars<3 ? position.enemy.townhallLevel : 'd'}`} />
                    {bestPerformedAttackContent ?
                        <span className={`wps-destruction wps-destruction-${bestAttack.destructionPercentage>=100?'done':bestAttack.destructionPercentage>0?'incomplete':'not-done'}`}>
                            {bestPerformedAttackContent}
                        </span>
                        :
                        null
                    }
                </div>
            </OverlayTrigger>
        );
    }
};

WarPositionStatus.defaultProps = {
    position: null
};

export default WarPositionStatus;