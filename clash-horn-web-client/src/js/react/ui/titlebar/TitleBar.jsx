import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import { connect, dispatch } from 'react-redux';

import horn from '../../../../img/horn.png';
import ClanAccountNavigator from './ClanAccountNavigator.jsx'

import { Switch, Route  } from 'react-router-dom'

class TitleBar extends React.Component {

    render() {
        
        return (
            <Navbar fluid fixedTop>
                <Navbar.Header>
                    <Navbar.Brand className="navbar-brand-img">
                        <a href="#">
                            <img src={horn} />
                        </a>
                    </Navbar.Brand>
                    <Navbar.Brand>
                        <a href="#">
                            Clash Horn
                        </a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                
                <Navbar.Collapse>
                    <Switch>
                        <Route path="/register" component={null} />
                        <Route path="/:cid" component={ClanAccountNavigator} />
                    </Switch>
                </Navbar.Collapse>
            </Navbar>
        );
    }

};

export default connect()(TitleBar);