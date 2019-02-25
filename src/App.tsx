/// <reference path="./common/interfaces.d.ts" />
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Bus from './components/bus/bus';
import Settings from './components/settings/settings';

// export const authorizedBuses = ['SEM:C1:15508', 'C38:EXP1:202481', 'C38:EXP2:202495'];

class App extends Component {
  intervalId: NodeJS.Timeout;
  state = {
    buses: [] as IBusProps[],
    isLoading: true,
    error: null
  }

  constructor(props: any) {
    super(props);
    this.getBuses();
    this.intervalId = setInterval(() => this.getBuses(), 10000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getBuses() {
    fetch('https://data.metromobilite.fr/api/routers/default/index/stops/SEM:1602/stoptimes')
      .then(response => response.json())
      .then(data => {
        this.setState({ buses: this.initBuses(data), isLoading: false });
      });
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
      listOfBuses.push({
        id: item.pattern.id,
        avatar: item.pattern.id.split(':')[0],
        direction: item.pattern.shortDesc,
        favorite: false,
        name: item.pattern.id.split(':')[1],
        times: this.getBusTimes(item.times)
      });
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
        avatar={bus.avatar} 
        direction={bus.direction} 
        favorite={bus.favorite}
        name={bus.name} 
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
            <div className="App__content__bus__title">Mes bus</div>
            <div  className="App__content__bus__section">
              {this.renderBusCards()}
            </div>
            <div className="App__content__bus__title">Autres bus</div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default App;
