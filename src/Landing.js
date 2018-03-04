import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {cyan300} from 'material-ui/styles/colors';
import MultiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {Launcher} from 'react-chat-window';
import {geolocated} from 'react-geolocated';

import io from 'socket.io-client'

import {DirectionsMap} from './DirectionsMap';
import Nav from './Nav';




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
            dataEntered: false        
        }

        this.buttonHandler = this.buttonHandler.bind(this)
        this.handleFirstName = this.handleFirstName.bind(this)
        this.handleLastName = this.handleLastName.bind(this)
        this.handlePhone = this.handlePhone.bind(this)
        this.handleAuthId = this.handleAuthId.bind(this)
        
       
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
                console.log(response,this.state)
                if(response.data[0]){
                    console.log(this)
                console.log(response)
                this.setState({
                 routeMessage: 'You have a new route!',
                 destLat: response.data[0].destlat,
                 destLon: response.data[0].destlon
                })
                console.log(this.state)
            }
            console.log(this.state)

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
        console.log(String(nextProps.coords.latitude))
        console.log(String(nextProps.coords.longitude))
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
          console.log(response)
      }).catch(err=>console.log(err))
      const {endpoint} = this.state;
      const socket = io(endpoint);
      socket.emit('MessagesChange');
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
            console.log('got the messages')
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
            console.log(response)
        })

        // go get route

        axios.get(`/api/routes2/${this.state.managerauthid}/${this.state.phone}`).then(response=>{
            console.log(response,this.state)
            if(response.data[0]){
                console.log(this)
            console.log(response)
            this.setState({
             routeMessage: 'You have a new route!',
             destLat: response.data[0].destlat,
             destLon: response.data[0].destlon
            })
            console.log(this.state)
        }
        console.log(this.state)

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

    

    render(){
       
        
       // console.log(this.props.coords.latitude)
       // console.log(this.props.coords.longitude);
        return(
            <div>
            <Nav dataEntered={this.state.dataEntered} />
            {(this.state.messaging) ?  
            <div>
                <h1>{this.state.routeMessage}</h1>
             {(this.state.destLat.length>0) ?
            <DirectionsMap 
            key={this.state.destLat}
            startingLat={parseFloat(this.state.latitude)}
            startingLon={parseFloat(this.state.longitude)}
            destLat={parseFloat(this.state.destLat)}
            destLon={parseFloat(this.state.destLon)}
            />
            : false
             }
            <Launcher
            agentProfile={{
              teamName: "Messenger"
              
            }}
            onMessageWasSent={this._onMessageWasSent.bind(this)}
            messageList={this.state.messageList}
            showEmoji={false}
          />
          
          <p> Displaying options for current route such as marking as complete(status = complete)</p>

            </div>
            :
            
            <div style={{ marginTop: 70}}>
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
            <h2>Welcome to the TRAX interface for employees</h2>
            <p>Connect with your manager</p>
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

