import React, { Component } from 'react';
import './settings.scss';

import StopList from '../../components/stop-list/stop-list';
import Icon from '@material-ui/core/Icon';

class Settings extends Component<ISettingsProps, any> {
    state = {
        nowDate: '',
        selectedStop: undefined,
        stops: [] as IStop[],
        stopList: [] as IStopList[]
    }

    constructor(props: ISettingsProps) {
        super(props);
        this.getPhysicalStops = this.getPhysicalStops.bind(this);
    }

    componentDidMount() {
        this.setNowDate();
        setInterval(()=> {
            this.setNowDate();
        }, 30000);
        this.getStops();
    }

    /**
     * Get all physical stop corresponding to a stop label
     */
    getPhysicalStops(name: string): void {
        fetch(`https://data.metromobilite.fr/api/findType/json?types=pointArret&query=${name}`)
        .then(response => response.json())
        .then((data: IPhysicalStopFeatures) => {
            this.props.retrieveBuses(data.features);
        });
    }

    /**
     * Get every stop
     */
    getStops(): void {
        fetch('https://data.metromobilite.fr/api/findType/json?types=arret')
            .then(response => response.json())
            .then((data: IStopFeatures) => {
            this.setState({ stops: data.features, stopList: this.initStops(data.features) });
        });
    }

    /**
     * Create a filtered list of unique stops
     */
    initStops(stops: IStop[]): IStopList[] {
        const listOfStops: IStopList[] = [];
    
        stops.forEach((stop: any) => {
            listOfStops.push({
                city: stop.properties.COMMUNE,
                codes: [stop.properties.CODE],
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

    /**
     * Set current time for the counter
     */
    setNowDate(): void {
        this.setState({ nowDate: new Date().toLocaleTimeString().slice(0,5) });
    }
  
    /**
     * Render component
     */
    render() {
        return (
        <div className="Settings">
            <div className="Settings__time">
                <Icon>access_time</Icon> {this.state.nowDate}
            </div>
            <StopList stops={this.state.stopList} getPhysicalStops={this.getPhysicalStops}/>
        </div>
        );
    }
}

export default Settings;