import React from 'react';
import CSSTransition  from 'react-transition-group/CSSTransition';
import TransitionGroup  from 'react-transition-group/TransitionGroup';
import { connect } from 'react-redux';

import { getFilteredAttackLog } from '../../../war-plan'

/**
 * WarPositionLog
 */
class WarPositionLog extends React.Component {
    
    render() {
        if (!this.props.war) {
            return null;
        }
        
        const log = getFilteredAttackLog(this.props.war, this.props.position);
        
        return (
            <div className="wp-queue">
                {log.map( (item, idx) =>
                    <div key={this.props.position.number+'-'+idx} className={`wp-log-item ${item.planned?"planned":"notplanned"}`}>
                        {item.executed ?
                            <span className={`executed stars-${item.stars}`}>{item.attacker.name}</span>
                        :
                            <span className="notexecuted">{item.attacker.name}</span>
                        }
                    </div>
                )}
            
            </div>
        );
    }
};

WarPositionLog.defaultProps = {
    war: null,
    position: null
};

export default connect(
    (store) => ({    })
)(WarPositionLog);