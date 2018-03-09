import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class Nav extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <nav style={{
                backgroundColor: 'black',
                height: 75,
                width: '100%',
                marginBottom: 0
            }}
            >
            <h1 style={{
                color: 'white',
                float: 'left',
                paddingBottom: 20,
                marginLeft: 40,
                marginBottom: 0
            }}
            >TRAX</h1>
            {(this.props.dataEntered) ?
            <a href='http://localhost:3001'>
               <h3 className='logoutButton'>Logout</h3>
                         
            </a>
                :
                false
            }    
            </nav>
        )
    }


}

/*
//<RaisedButton
label="Logout"
style={{
  marginTop: 5,
  marginRight: 40,
  float: 'right'
}}
/>
*/

/*
google-oauth2|102968060148129405845




*/