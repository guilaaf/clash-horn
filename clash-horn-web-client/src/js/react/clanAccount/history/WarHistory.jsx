import React from 'react';
import { connect } from 'react-redux';

export class WarHistory extends React.Component {
   
    render() {
        return (
                <div>
                    Coming Soon !
                </div>
        );
    }
};

export default connect(
    (store) => ({
        clanAccount: store.clans.clanAccount
    })
)(WarHistory);
