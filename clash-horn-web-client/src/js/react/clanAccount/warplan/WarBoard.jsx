import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Button from 'react-bootstrap/lib/Button';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';


import WarPosition from './WarPosition.jsx';
import ClanBadge from '../../ui/ClanBadge.jsx';
import { getWarRemainingTime, getWarAttackCount, isPreparation, isInProgress, isDraw, isVictory, isDefeat } from '../../../war-plan'

import badgeExample from '../../../../img/badge-example.png';

class WarBoard extends React.Component {
    
    refreshWar() {
        this.props.onRefreshWar();
    }
    
    render() {
        if (!this.props.war) {
            return null;
        }
        
        const currentTime = new Date().getTime();
        const clanNameClassSuffix = Math.ceil(this.props.war.clan.name.length / 3);
        const enemyNameClassSuffix = Math.ceil(this.props.war.enemy.name.length / 3);
        
        let warStatusContent;
        
        if (isPreparation(this.props.war)) {
            warStatusContent = (<strong className="text-info"><Glyphicon glyph="dashboard" /> PREPARATION TIME</strong>);
        } else if (isInProgress(this.props.war)) {
            warStatusContent = (<strong className="text-warning"><Glyphicon glyph="fire" /> WAR IN PROGRESS</strong>);
        } else if (isDraw(this.props.war)) {
            warStatusContent = (<strong className="text-danger"><Glyphicon glyph="thumbs-down" /> DRAW</strong>);
        } else if (isVictory(this.props.war)) {
            warStatusContent = (<strong className="text-success"><Glyphicon glyph="thumbs-up" /> VICTORY</strong>);
        } else if (isDefeat(this.props.war)) {
            warStatusContent = (<strong className="text-danger"><Glyphicon glyph="thumbs-down" /> DEFEAT</strong>);
        };
        
        const tooltip = (<Tooltip id="refresh-war">Click to refresh war data from Clash of Clans server</Tooltip>);
        
        return (
            <div className="war-board">
                <Row>
                    <Col md={3} mdOffset={3} sm={6} xs={6}>
                        <div className="war-board-col">
                            <div className="clan-badge" style={{'backgroundImage':  `url('${this.props.war.clan.badge}')`}} />

                            <div className="war-board-stars">
                                {this.props.war.clanScore.stars}
                            </div>
                            
                            <div className="war-board-destruction">
                                <Glyphicon glyph="fire" />
                                {' '}
                                {this.props.war.clanScore.destruction}%
                            </div>

                            <div className={`war-board-name`}>
                                {this.props.war.clan.name}
                            </div>
                        </div>
                    </Col>
                    
                    <Col md={3} sm={6} xs={6}>
                        <div className="war-board-col">
                            <div className="clan-badge" style={{'backgroundImage':  `url('${this.props.war.enemy.badge}')`}} />

                            <div className="war-board-stars">
                                {this.props.war.enemyScore.stars}
                            </div>
                            
                            <div className="war-board-destruction">
                                <Glyphicon glyph="fire" />
                                {' '}
                                {this.props.war.enemyScore.destruction}%
                            </div>

                            <div className={`war-board-name`}>
                                {this.props.war.enemy.name}
                            </div>
                        </div>
                    </Col>
                </Row>
                
                <Row>
                    <Col md={6} mdOffset={3} sm={12} xs={12}>
                    <div className="war-status">
                        <div className="pull-right">
                            <OverlayTrigger overlay={tooltip}>
                                <Button bsStyle="primary" bsSize="xsmall" onClick={this.refreshWar.bind(this)}>
                                    <Glyphicon glyph="globe"></Glyphicon>
                                </Button>
                            </OverlayTrigger>
                        </div>
                        <p>{warStatusContent}</p>
                        <p className="text-secondary"><Glyphicon glyph="time"> </Glyphicon>  {getWarRemainingTime(this.props.war, currentTime)}	</p>
                        <p className="text-secondary"><Glyphicon glyph="king"> </Glyphicon>  {getWarAttackCount(this.props.war)} </p>
                    </div>
                    </Col>
                </Row>
                
                {this.props.war.positions.map( (p) => 
                    <Row key={p.member.tag}>
                        <Col md={6} mdOffset={3} sm={12} xs={12}>
                            <WarPosition war={this.props.war} position={p}  />
                        </Col>
                    </Row>
                )}
            </div>
        );
    }
};

WarBoard.defaultProps = {
    war: null,
    onRefreshWar: () => {}
};

export default WarBoard
