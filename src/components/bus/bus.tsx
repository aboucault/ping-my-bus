/// <reference path="../../common/interfaces.d.ts" />
import React, { Component } from 'react';
import './bus.scss';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import Icon from '@material-ui/core/Icon';

class Bus extends Component<IBusProps, any> {
  bus: any;

  constructor(props: IBusProps) {
    super(props);
    this.bus = props;
  }

  renderTimes() {
    return this.bus.times.slice(1, this.bus.times.length).map((time: string, i: number) =>
      <Typography
        key={i}
        component="p"
      >
        {time}
      </Typography>
    );
  }

  render() {
    return (
      <Card className="Bus">
        <CardHeader
          className="Bus__header"
          avatar={
            <Avatar aria-label="Ligne" className={`avatar-${this.bus.avatar}`}>
              {this.bus.avatar}
            </Avatar>
          }
          action={
            <IconButton>
              <StarIcon />
            </IconButton>
          }
          title={
            <span className="header-title">{this.bus.name}</span>
          }
          subheader={
            <span className="header-subheader"><Icon>arrow_forward</Icon> {this.bus.direction}</span>
          }
        />
        <CardContent className="Bus__content">
          <Typography className="Bus__content__direction" color="textSecondary">
            Prochain bus
          </Typography>
          <div className="Bus__content__first-bus">
            {this.bus.times[0] ? <Icon>warning</Icon> : ''} {this.bus.times[0]}
          </div>
          <Typography className="Bus__content__direction" color="textSecondary">
            Bus suivants
          </Typography>
          {this.renderTimes()}
        </CardContent>
      </Card>
    );
  }
}

export default Bus;