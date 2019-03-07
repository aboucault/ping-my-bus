/// <reference path="../../common/interfaces.d.ts" />
import React, { Component, ReactType } from 'react';

import Downshift from 'downshift';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import './stop-list.scss';

class StopList extends Component<IStopListProps, any> {
    lastSelected = localStorage.getItem('lastSelectedStop') || null;
    isItemSelected = !!localStorage;

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
        if(selectedStop) {
            localStorage.setItem('lastSelectedStop', JSON.stringify(selectedStop));
            this.getPhysicalStops(selectedStop.label);
            this.isItemSelected = true;
        }
        this.isItemSelected = false;
    }

    renderDownshift() {
        return this.props.stops && this.props.stops.length > 0 ? (
            <Downshift
                onChange={selection => this.onChange(selection)}
                itemToString={item => (item ? item.label : '')}
                onOuterClick={() => this.setState({menuIsOpen: false})}
                initialSelectedItem={this.lastSelected ? JSON.parse(this.lastSelected) : null}
                initialInputValue={this.lastSelected ? JSON.parse(this.lastSelected).label : ''}
            >
                {({
                    getInputProps,
                    getItemProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    selectedItem,
                    clearSelection
                }) => (
                    <div className="stop-list__autocomplete">
                        <span className="stop-list__autocomplete__input-goup">
                            <input
                                className="stop-list__autocomplete__input-goup__input"
                                {...getInputProps({ placeholder: "Chercher un arrêt", onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value === '') {
                                        clearSelection();
                                    }
                                }})}
                            />
                            {this.isItemSelected ? (<IconButton aria-label="Clear" onClick={() => clearSelection()}>
                                <ClearIcon fontSize="small" />
                            </IconButton>) : ''}
                         </span>
                        
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
            {this.renderDownshift()}
          </section>
        );
      }
}
  
export default StopList;
