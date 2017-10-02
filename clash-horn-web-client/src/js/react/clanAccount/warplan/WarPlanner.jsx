import React from 'react';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { connect } from 'react-redux';

import WarBoard from './WarBoard.jsx';
import CoCStatusAlert from '../../ui/CoCStatusAlert.jsx';

import { fetchWarPlan, pushToAttackQueue, removeFromAttackQueue } from '../../../flux/actions/clans';
import pathValue from '../../../util/path-value';

export class WarPlanner extends React.Component {
    
    componentWillMount() {
       // Load war plan on mount
        this.loadWarPlan(this.props.clanAccount.id, this.props.match.params.wid);
    }
   
    componentWillReceiveProps(nextProps) {
        // Load war plan on clan account or warId change
        if (    pathValue(nextProps, 'clanAccount', 'id') !== pathValue(this.props, 'clanAccount', 'id') 
             || nextProps.match.params.wid !== this.props.match.params.wid) {
            this.loadWarPlan(nextProps.clanAccount.id, this.props.match.params.wid);
        }
    }
    
    loadWarPlan(clanAccountId, warPlanId, forceReload) {
        if (!this.props.warPlan || forceReload) {
            this.props.dispatch(fetchWarPlan(clanAccountId, warPlanId==='current'?null:warPlanId));
        }
    }
    
    refresh() {
        this.loadWarPlan(this.props.clanAccount.id, this.props.match.params.wid, true);
    }
    
    render() {
        if (this.props.fetching['fetchClanAccount']) {
            return (<span><Glyphicon glyph="refresh" /> Loading clan account data ...</span>);
        } else if (this.props.fetching['fetchWarPlan']) {
            return (<span><Glyphicon glyph="refresh" /> Loading war data ...</span>);
        } else {
            return (
                <div>
                    <CoCStatusAlert method="fetchWarPlan" denied="Request to fetch war data from Clash of Clans data service was denied. Make sure your clan's war log is public to use it on Clash Horn" />
                    <WarBoard war={this.props.warPlan} onRefreshWar={this.refresh.bind(this)} />
                </div>
            );
        }
    

    }
};

export default connect(
    (store) => ({
        fetching: store.clans.fetching,
        clanAccount: store.clans.clanAccount,
        warPlan: store.clans.openWarPlan
    })
)(WarPlanner);
