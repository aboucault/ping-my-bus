/// <reference path="./common/interfaces.d.ts" />
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Bus from './components/bus/bus';
import Settings from './components/settings/settings';

export const authorizedBuses = ['SEM:C1:15508', 'C38:EXP1:202481', 'C38:EXP2:202495'];

class App extends Component {
  state = {
    buses: [] as IBusProps[], isLoading: true, error: null
  }

  componentDidMount() {
    try {
      this.getBuses().then(response => response.json())
                     .then(data => this.setState({ buses: this.initBuses(data), isLoading: false }));
      
      setInterval(()=> {
        this.getBuses().then(response => response.json())
                     .then(data => this.setState({ buses: this.initBuses(data), isLoading: false }));
      }, 60000);
    } catch (error) {
      this.setState({ error, isLoading: false });
    }
  }

  getBuses() {
    return fetch('https://data.metromobilite.fr/api/routers/default/index/stops/SEM:1602/stoptimes');
  }

  getBusAvatar(id: string): string {
    switch(id) {
      case 'SEM:C1:15508':
        return 'C1'; 
      case 'C38:EXP1:202481':
        return 'E1'; 
      case 'C38:EXP2:202495':
        return 'E2'; 
      default:
        return id;
    }
  }

  getBusName(id: string): string {
    switch(id) {
      case 'SEM:C1:15508':
        return 'C1'; 
      case 'C38:EXP1:202481':
        return 'Express 1'; 
      case 'C38:EXP2:202495':
        return 'Express 2'; 
      default:
        return id;
    }
  }

  getBusTimes(times: any): ITimeProps[] {
    return times
            .map((time: any) => {
              const diffDate = new Date(time.realtimeArrival*1000).getTime() - new Date().getTime();
              return {
                schedule: new Date(time.realtimeArrival*1000).toISOString().slice(-13, -8),
                hurry: new Date(diffDate).getMinutes() < 10
              }
            })
            .slice(0,3);
  }

  initBuses(items: any): IBusProps[] {
    const listOfBuses: IBusProps[] = [];
    
    items.forEach((item: any) => {
      if (authorizedBuses.includes(item.pattern.id)) {
        listOfBuses.push({
          id: item.pattern.id,
          name: this.getBusName(item.pattern.id),
          avatar: this.getBusAvatar(item.pattern.id),
          direction: item.pattern.shortDesc,
          times: this.getBusTimes(item.times)
        });
      }
    });
    return listOfBuses;
  }

  renderBusCards() {
    const { buses, isLoading, error } = this.state;

    if (error) {
      return <div>Oups!</div>;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return buses.map((bus: IBusProps, i: number) =>
      <Bus
        key={i}
        id={bus.id}
        name={bus.name} 
        avatar={bus.avatar} 
        direction={bus.direction} 
        times={bus.times}
      />
    );
  }

  render() {
        return (
      <div className="App">
        <header className="App__header">
          <img src={logo} className="App__header__logo" alt="logo" />
          <div className="App__header__title">
            Ping My Bus
          </div>
        </header>
        <div className="App__content">
          <div className="App__content__settings">
            <Settings />
          </div>
          <div className="App__content__bus">
            {this.renderBusCards()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
