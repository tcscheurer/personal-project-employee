import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {cyan300} from 'material-ui/styles/colors';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';
import {Launcher} from 'react-chat-window';
import {geolocated} from 'react-geolocated';

import io from 'socket.io-client'

import {DirectionsMap} from './DirectionsMap';
import Nav from './Nav';
import RouteCard from './RouteCard';




const styles = {
    errorStyle: {
        color: 'black',
      },
    floatingLabelStyle: {
        color: 'black',
      },
    floatingLabelFocusStyle: {
        color: 'black',
      }
}

class Landing extends Component{
    constructor(props){
        super(props);
        this.state={
            firstName: '',
            lastName: '',
            phone: '',
            managerauthid: '',
            latitude: '',
            longitude: '',
            destLat: '',
            destLon: '',
            routeMessage: 'All Caught Up! You will be notified if this changes.',
            messaging: false,
            messageList: [],
            endpoint: 'http://localhost:5000',
            dataEntered: false,
            routeDescription: ''    
        }

        this.buttonHandler = this.buttonHandler.bind(this)
        this.handleFirstName = this.handleFirstName.bind(this)
        this.handleLastName = this.handleLastName.bind(this)
        this.handlePhone = this.handlePhone.bind(this)
        this.handleAuthId = this.handleAuthId.bind(this)
        this.handleCompleteRoute = this.handleCompleteRoute.bind(this)
       
    }

    componentDidMount(){
        const {endpoint} = this.state;
        const socket = io(endpoint);
        socket.on('MessagesChange',()=>{
            axios.get(`/api/messages/employee/${this.state.managerauthid}/${this.state.phone}`).then(response=>{
                let unfiltered = response.data;
                let actual = [];
                for(let i=0;i<unfiltered.length;i++){
                    if(unfiltered[i].type==='toEmpl'){
                        actual[i] = {
                            author: 'them',
                            type: 'text',
                            data: {text: unfiltered[i].body}
                        }
                    } else {
                        actual[i] = {
                            author: 'me',
                            type: 'text',
                            data: {text: unfiltered[i].body}
                        }
                    }
                }
                this.setState({
                    messageList: actual
                })
            }).catch(err=>console.log(err))
        })

        socket.on('RoutesUpdate',()=>{
            console.log('RoutesUpdateReceived')
            axios.get(`/api/routes2/${this.state.managerauthid}/${this.state.phone}`).then(response=>{
                
                if(response.data[0]){                
                this.setState({
                 routeMessage: 'You have a new route!',
                 destLat: response.data[0].destlat,
                 destLon: response.data[0].destlon,
                 routeDescription: response.data[0].description
                })
                console.log(this.state)
            }
            

             }).catch(err=>console.log(err))
            
        })

    }

    componentWillReceiveProps(nextProps){
        if(this.props!=nextProps){
            this.setState({
                latitude: String(nextProps.coords.latitude),
                longitude: String(nextProps.coords.longitude)
            })
        }
        
    }

    _onMessageWasSent(message) {
       
        
      this.setState({
        messageList: [...this.state.messageList, message]
      })
      const obj = {
          managerauthid: this.state.managerauthid,
          phone: this.state.phone,
          body: message.data.text
      }
      
      axios.post('/api/message/employee',obj).then(response=>{
        const {endpoint} = this.state;
        const socket = io(endpoint);
        socket.emit('MessagesChange');
      }).catch(err=>console.log(err))
      // moved socket emit inside
    }
   
    _sendMessage(text) {
      if (text.length > 0) {
        this.setState({
          messageList: [...this.state.messageList, {
            author: 'them',
            type: 'text',
            data: { text }
          }]
        })
      }
    }

    buttonHandler(){

        // Go get messages

        axios.get(`/api/messages/employee/${this.state.managerauthid}/${this.state.phone}`).then(response=>{
            let unfiltered = response.data;
            let actual = [];
            for(let i=0;i<unfiltered.length;i++){
                if(unfiltered[i].type==='toEmpl'){
                    actual[i] = {
                        author: 'them',
                        type: 'text',
                        data: {text: unfiltered[i].body}
                    }
                } else {
                    actual[i] = {
                        author: 'me',
                        type: 'text',
                        data: {text: unfiltered[i].body}
                    }
                }
            }
            this.setState({
                messageList: actual
            })
           
        }).catch(err=>console.log(err))

    let obj = {
        name: `${this.state.firstName} ${this.state.lastName}`,
        phone: this.state.phone,
        managerauthid: this.state.managerauthid,
        latitude: this.state.latitude,
        longitude: this.state.longitude
    }

        // Post employee

        axios.post('/api/employee',obj).then(response=>{
           
        })

        // go get route

        axios.get(`/api/routes2/${this.state.managerauthid}/${this.state.phone}`).then(response=>{
            
            if(response.data[0]){
            
            this.setState({
             routeMessage: 'You have a new route!',
             destLat: response.data[0].destlat,
             destLon: response.data[0].destlon,
             routeDescription: response.data[0].description
            })
            
        }
         }).catch(err=>console.log(err))
        
        this.setState({
            dataEntered: true
        })
        
        this.setState({
            messaging: true
        })
    }

    handleFirstName(e){
        this.setState({
            firstName: e.target.value
        })
    }
    
    handleLastName(e){
        this.setState({
            lastName: e.target.value
        })
    }

    handlePhone(e){
        this.setState({
            phone: e.target.value
        })
    }

    handleAuthId(e){
        this.setState({
            managerauthid: e.target.value
        })
    }

    handleCompleteRoute(){
        const body = {
            phone: this.state.phone,
            destlat: this.state.destLat,
            destlon: this.state.destLon
        }
        console.log('button handler fired')
        axios.put(`/api/routes/${this.state.managerauthid}`,body).then(response=>{
            const {endpoint} = this.state;
            const socket = io(endpoint);
            socket.emit('RoutesUpdate');
        }).catch((err)=>console.log(err));
        this.setState({
            destLat: '',
            routeMessage: 'All caught up! You will be notified if this changes.'
        })
    }

    

    render(){
       
        
       // console.log(this.props.coords.latitude)
       // console.log(this.props.coords.longitude);
        return(
            <div>
            <Nav dataEntered={this.state.dataEntered} />
            {(this.state.messaging) ?  
            <div>
                <h1>{this.state.routeMessage}</h1>
                <h4>{this.state.routeMessage == 'You have a new route!' && 'Please refer to map for directions'}</h4>
             {(this.state.destLat.length>0) ?
             <div>
            <DirectionsMap 
            key={this.state.destLat}
            startingLat={parseFloat(this.state.latitude)}
            startingLon={parseFloat(this.state.longitude)}
            destLat={parseFloat(this.state.destLat)}
            destLon={parseFloat(this.state.destLon)}
            /><br /><br />
            <div>
                <h1>Current Route</h1>
                <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                    <div >
                    <h3>Desctiption:</h3>
                    <h5>{this.state.routeDescription}</h5>
                    </div>
                    <button className='completeButton'
                    onClick={()=>this.handleCompleteRoute()}
                    
                    >
                        Mark Complete
                    </button>
                </div><br/><br/>
            </div>
            </div>
            : 
            false
             }
            <Launcher
            agentProfile={{
              teamName: "Messenger"
              
            }}
            onMessageWasSent={this._onMessageWasSent.bind(this)}
            messageList={this.state.messageList}
            showEmoji={false}
          />
          
          

            </div>
            :
            
            <div className="landingWrapper">
                    <div>
                        <h2 className="introMessage">Welcome to the TRAX interface for employees.</h2>
                        <p>We provide creative solutions to manage communitation of logistics between you and your employer.</p>
                    </div>
                    <div className="landingForm">
                    <h4>Connect with your manager</h4>
                    <TextField 
                    hintText="First Name"
                    hintStyle={styles.errorStyle}
                    onChange={(e)=>this.handleFirstName(e)}
                    /><br/>
                    <TextField 
                    hintText="Last Name"
                    hintStyle={styles.errorStyle}
                    onChange={(e)=>this.handleLastName(e)}
                    /><br/>
                    <TextField 
                    hintText="Phone Number (1234567890)"
                    hintStyle={styles.errorStyle}
                    onChange={(e)=>this.handlePhone(e)}
                    /><br/>
                    <TextField 
                    floatingLabelText="Group Code"
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    errorText="Your manager should provide this."
                    errorStyle={styles.errorStyle}
                    onChange={(e)=>this.handleAuthId(e)}
                    /><br/>
                    <FlatButton style={{marginBottom: 70}} onClick={()=>{this.buttonHandler()}} label="Submit" fullWidth={true} />
                    <br />
                </div>
            </div>
            }
            </div>
        )
    }
}

export default geolocated ({
     positionOptions: {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: Infinity,
    },
    watchPosition: true,
    userDecisionTimeout: null,
        
})(Landing);

