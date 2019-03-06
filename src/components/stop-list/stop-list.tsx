/// <reference path="../../common/interfaces.d.ts" />
import React, { Component } from 'react';
import './stop-list.scss';

import Downshift from 'downshift';

class StopList extends Component<IStopListProps, any> {
    lastSelected = localStorage.getItem('lastSelectedStop') || null;

    constructor(props: IStopListProps) {
      super(props);
    }
    
    getPhysicalStops(name: string) {
        fetch(`https://data.metromobilite.fr/api/findType/json?types=pointArret&query=${name}`)
        .then(response => response.json())
        .then((data: any) => {
        console.log(data);
    });
    }

    onChange = (selectedStop: IStopList) => {
        const selected = JSON.stringify(selectedStop);
        localStorage.setItem('lastSelectedStop', selected);
        this.getPhysicalStops(selectedStop.label);
    }

    renderDownshift() {
        return this.props.stops && this.props.stops.length > 0 ? (
            <Downshift
                onChange={selection => this.onChange(selection)}
                onStateChange={state => this.setState({state})}
                itemToString={item => (item ? item.label : '')}
                onOuterClick={() => this.setState({menuIsOpen: false})}
                selectedItem={this.lastSelected ? JSON.parse(this.lastSelected) : null}
                inputValue={this.lastSelected ? JSON.parse(this.lastSelected).label : ''}
            >
                {({
                    getInputProps,
                    getItemProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    selectedItem
                }) => (
                    <div className="stop-list__autocomplete">
                        <input className="stop-list__autocomplete__input" {...getInputProps({ placeholder: "Chercher un arrêt" })} />
                        {isOpen ? (
                            <div className="stop-list__autocomplete__dropdown">
                                {
                                    // filter the books and return items that match the inputValue
                                    this.props.stops
                                    .filter(item => !inputValue || item.label.toLowerCase().includes(inputValue.toLowerCase()))
                                    // map the return value and return a div
                                    .map((item, index) => (
                                        <div
                                            className="stop-list__autocomplete__dropdown__item"
                                            {...getItemProps({ key: item.label, index, item })}
                                            style={{
                                                backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                                fontWeight: selectedItem === item ? 'bold' : 'normal'
                                            }}>
                                            {item.label} ({item.city})
                                        </div>
                                    ))
                                }
                            </div>
                        ) : null}
                    </div>
                )}
            </Downshift>
            // 'coucou'
        ) : null;
    }

    render() {
        return (
          <section className="stop-list">
            | {this.renderDownshift()}
          </section>
        );
      }
}
  
export default StopList;
