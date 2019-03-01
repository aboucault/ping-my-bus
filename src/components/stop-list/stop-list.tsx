/// <reference path="../../common/interfaces.d.ts" />
import React, { Component } from 'react';
import './stop-list.scss';

import Downshift from 'downshift';

class StopList extends Component<IStopListProps, any> {
    constructor(props: IStopListProps) {
      super(props);
    }

    onChange = (selectedStop: IStopList) => {
        alert(`your favourite stop is ${selectedStop.label}`)
    }

    renderDownshift() {
        return this.props.stops && this.props.stops.length > 0 ? (
            <Downshift
                onChange={selection => alert(`You selected ${selection.label}`)}
                itemToString={item => (item ? item.label : '')}
                onOuterClick={() => this.setState({menuIsOpen: false})}
            >
                {({
                    getInputProps,
                    getItemProps,
                    getLabelProps,
                    isOpen,
                    inputValue,
                    highlightedIndex,
                    selectedItem
                }) => (
                    <div>
                        <label {...getLabelProps()}>Arrêt...</label> <br />
                        <input {...getInputProps({ placeholder: "Chercher un arrêt" })} />
                        {isOpen ? (
                            <div className="downshift-dropdown">
                                {
                                    // filter the books and return items that match the inputValue
                                    this.props.stops
                                    .filter(item => !inputValue || item.label.toLowerCase().includes(inputValue.toLowerCase()))
                                    // map the return value and return a div
                                    .map((item, index) => (
                                        <div
                                        className="dropdown-item"
                                        {...getItemProps({ key: item.label, index, item })}
                                        style={{
                                            backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                                        }}>
                                        {item.label}
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
