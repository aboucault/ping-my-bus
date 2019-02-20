/// <reference path="./common/interfaces.d.ts" />
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Bus from './components/bus/bus';
import Settings from './components/settings/settings';
import Icon from '@material-ui/core/Icon';

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
    this.intervalId = setInterval(() => this.getBuses(), 10000);
    this.manageFavorite = this.manageFavorite.bind(this);
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
            .map((time: any, index: number) => {
              const diffDate = new Date(time.realtimeArrival*1000).getTime() - new Date().getTime();
              console.log('bus' + index,  new Date(diffDate).getMinutes());
              
              return {
                schedule: new Date(time.realtimeArrival*1000).toISOString().slice(-13, -8),
                hurry: new Date(diffDate).getMinutes() < 10,
                hurryNow: new Date(diffDate).getMinutes() <= 1
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
        direction: item.pattern.desc,
        favorite: this.isFavorite(item.pattern.id),
        manageFavorite: this.manageFavorite,
        name: item.pattern.id.split(':')[1],
        times: this.getBusTimes(item.times)
      });
    });
    return listOfBuses;
  }

  isFavorite(busId: string): boolean {
    const favorites = localStorage.getItem('favoriteBuses');
     if (favorites && favorites.includes(busId)) {
      return true;
     } else {
       return false;
     }
  }

  manageFavorite(busId: string) {
    // init favorite buses - remove [] from array and quotes around each value
    let favoriteBuses: string[] = [];
    let favorites = localStorage.getItem('favoriteBuses');
    if (favorites) {
      favoriteBuses = favorites.substring(1, favorites.length - 1).split(',').map((bus: string) => bus.substring(1, bus.length - 1));
    }

    if(!favorites || (favorites && !favorites.includes(busId))) {
      favoriteBuses.push(busId);
    } else if(favorites && favorites.includes(busId)) {
      const index: number = favoriteBuses.findIndex((id: string) => id === busId);
      favoriteBuses.splice(index, 1);
    }

    favorites = JSON.stringify(favoriteBuses);
    
    const updatedBuses: IBusProps[] = this.state.buses.map((bus:IBusProps) => {
      if (favorites && favorites.includes(bus.id)) {
        bus.favorite = true;
      } else {
        bus.favorite = false;
      }
      return bus;
    });
    this.setState({ buses: updatedBuses });
    localStorage.setItem('favoriteBuses', favorites);
  }

  renderBusCards(favorite: boolean) {
    const { buses, isLoading, error } = this.state;

    if (error) {
      return <div>Oups!</div>;
    }

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return buses.filter((bus: IBusProps) => bus.favorite === favorite)
                .map((bus: IBusProps, i: number) =>
      <Bus
        key={i}
        id={bus.id}
        avatar={bus.avatar} 
        direction={bus.direction} 
        favorite={bus.favorite}
        manageFavorite={bus.manageFavorite}
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
            <div className="App__content__bus__title"><Icon>star</Icon> Mes bus</div>
            <div  className="App__content__bus__section">
              {this.renderBusCards(true)}
            </div>
            <div className="App__content__bus__title"><Icon>directions_bus</Icon> Autres bus</div>
            <div  className="App__content__bus__section">
              {this.renderBusCards(false)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
