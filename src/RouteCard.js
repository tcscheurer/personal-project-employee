import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

class RouteCard extends React.Component{

    constructor(){
        super();
        this.state = {
            description: ''
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props !== nextProps){
            this.setState({
                description: nextProps.description
            })
        }
    }

    render(){
        return(
    <div>
        <Card key={this.props.description}>
        <CardHeader
        title="Current Route"
        subtitle="status : status"
        actAsExpander={true}
        showExpandableButton={true}
        />
        <CardActions>
        <FlatButton label="Complete Route!" />
        </CardActions>
        <CardText expandable={true}>
        {this.state.description}
        </CardText>
        </Card>
  </div>
)
}
}

export default RouteCard;