import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import Label from 'react-bootstrap/lib/Label';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import {connect} from 'react-redux';

import WarQueue from './WarQueue.jsx'
import WarPositionStatus from './WarPositionStatus.jsx'

import { elligilePositionsForPushToQueue } from '../../../war-plan'
import { pushToAttackQueue } from '../../../flux/actions/clans'

/**
 * WarPosition label
 */
class WarPosition extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            attackerPosition: -1,
            modal: null
        };
    }
    
    planAttack() {
        this.closePlanAttackModal();
        this.props.dispatch(pushToAttackQueue(this.props.war.id, this.props.position.number, this.state.attackerPosition));
    }
    
    showPlanAttackModal() {
        this.setState({ modal: 'planAttack' });
    }
    
    closePlanAttackModal() {
        this.setState({ modal: null });
    }
    
    isPlanning() {
        return this.props.fetching['pushToAttackQueue'] 
            && this.props.fetching['pushToAttackQueue'][0]==this.props.war.id
            && this.props.fetching['pushToAttackQueue'][1]==this.props.position.number;
    }
    
    render() {
        if (!this.props.war) {
            return null;
        }
        
        const war = this.props.war;
        const position = this.props.position;
        const elligibleForPush = elligilePositionsForPushToQueue(war, position);
        
        const modalInstance = (
            <Modal show={this.state.modal==='planAttack'} onHide={this.closePlanAttackModal.bind(this)} bsSize="sm">
              <Modal.Body>
                    <FormGroup>

                        <ControlLabel>
                            Available clan members:
                        </ControlLabel>
                        <FormControl componentClass="select" 
                                     className={`coc-font ${this.state.attackerPosition==-1?"prompt":""}`} 
                                     value={this.state.attackerPosition} 
                                     onChange={(evt)=> this.setState({attackerPosition: parseInt(evt.target.value)})}>

                            <option value={-1} disabled>-- Select a member --</option>
                            {elligibleForPush.map( pos => (
                                <option key={pos.member.tag} value={pos.number} className="text-primary">
                                    {pos.number}.
                                    {' '}
                                    {pos.member.name}
                                </option>
                            ))}

                        </FormControl>
                        
                    </FormGroup>
                    <Row>
                        <Col xs={12}>
                            <h4 className="line-icon">
                                <Glyphicon glyph="info-sign" />
                            </h4>
                            <span className="text-secondary">
                                Members on this list are the ones with available attacks and not already planned for this position
                            </span>
                        </Col>
                    </Row>
              </Modal.Body>
              
              <Modal.Footer>
                <ButtonGroup justified>
                      <Button bsStyle="danger" href="#" onClick={this.closePlanAttackModal.bind(this)}>Cancel</Button>
                      <Button bsStyle="success" href="#" onClick={this.planAttack.bind(this)} disabled={this.state.attackerPosition<1}>Confirm</Button>
                </ButtonGroup>
              </Modal.Footer>
            </Modal>
        );
        
        return (
            <div className="wp">
                {modalInstance}
                <Row>
                    <Col md={2} sm={2} xs={2}>
                        <WarPositionStatus war={this.props.war} position={this.props.position} />
                    </Col>
                    
                    <Col md={10} sm={10} xs={10}>
                    
                        <h4>
                            {position.number}. {position.enemy.name}
                        </h4>
                        
                        <WarQueue war={war} position={position} />
                        
                    </Col>
                    
                    <div className="wp-actions">
                        <Button bsSize="xsmall" onClick={this.showPlanAttackModal.bind(this)} disabled={this.isPlanning()}>
                            {this.isPlanning()?
                            <Glyphicon glyph="refresh" />    
                            :
                            <Glyphicon glyph="plus" />    
                            }
                        </Button>
                    </div>
                    
                </Row>
            </div>
        );
    }
};

WarPosition.defaultProps = {
    war: null,
    position: null
};

export default connect(
    (store) => ({
        fetching: store.clans.fetching
    })
)(WarPosition);