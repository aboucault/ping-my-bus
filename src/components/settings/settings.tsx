import React, { Component } from 'react';
import './settings.scss';

import Icon from '@material-ui/core/Icon';

class Settings extends Component {
    state = {
        nowDate: ''
    }

    componentDidMount() {
        this.setNowDate();
        setInterval(()=> {
            this.setNowDate();
        }, 30000);
    }

    setNowDate(): void {
        this.setState({ nowDate: new Date().toLocaleTimeString().slice(0,5) });
    }
  
    render() {
        return (
        <div className="Settings">
            <div className="Settings__time">
                <Icon>access_time</Icon> {this.state.nowDate}
            </div>
            <div className="Settings__stop">
                | Victor Hugo
            </div>
        </div>
        );
    }
}

export default Settings;