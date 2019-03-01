import React, { Component } from 'react';
import './settings.scss';

import StopList from '../../components/stop-list/stop-list';
import Icon from '@material-ui/core/Icon';
import MenuItem from '@material-ui/core/MenuItem';

class Settings extends Component {
    state = {
        nowDate: '',
        selectedStop: undefined,
        stops: [] as IStop[],
        stopList: [] as IStopList[]
    }

    componentDidMount() {
        this.setNowDate();
        setInterval(()=> {
            this.setNowDate();
        }, 30000);
        this.getStops();
    }

    getStops() {
        // https://data.metromobilite.fr/api/findType/json?types=pointArret
        fetch('https://data.metromobilite.fr/api/findType/json?types=arret')
            .then(response => response.json())
            .then((data: IBackendFeatures) => {
            this.setState({ stops: data.features, stopList: this.initStops(data.features) });
        });
    }

    initStops(stops: IStop[]) {
        const listOfStops: IStopList[] = [];
    
        stops.forEach((stop: any) => {
            listOfStops.push({
                codes: [stop.properties.id],
                label: stop.properties.LIBELLE
            });
        });

        listOfStops.forEach((stop: IStopList) => {
            const duplicates: IStopList[] = listOfStops.filter((v) => {
                return v.label.toLowerCase().trim() === stop.label.toLowerCase().trim();
            });

            if (duplicates && duplicates.length > 0 && !stop.isDupplicate) {

                duplicates.forEach((dup: IStopList) => {
                    const duplicatesIndex = listOfStops.indexOf(dup);
                    stop.codes.concat(listOfStops[duplicatesIndex].codes);
                    stop.isDupplicate = false;
                    listOfStops[duplicatesIndex].isDupplicate = true;
                });
            }
        });
        
        return listOfStops.filter(stop => !stop.isDupplicate)
                          .sort((a: IStopList, b: IStopList) => {
                              if(a.label < b.label) { return -1; }
                              if(a.label > b.label) { return 1; }
                              return 0;
                          });
    }

    onStopSelection = (event: React.ChangeEvent<HTMLElement>) => {
        this.setState({ selectedStop: event.target });
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
            <StopList stops={this.state.stopList}/>
        </div>
        );
    }
}

export default Settings;