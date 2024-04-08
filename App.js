import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import React, { Component } from 'react'
import { fcmService } from './src/FCMService';
import { localNotificationService } from './src/NotifService';

class App extends Component {
  constructor(props) {
    super(props)
  }

  async componentWillUnmount() {
    console.log("willUnMonunt");
    fcmService.unRegisterListenerWithFCM();
  }

  async componentDidMount() {
    await fcmService.getFcmToken(this.onRegister.bind(this));
    await fcmService.registerListenerWithFCM(
      this.onNotification.bind(this),
      this.onBackgroundNotification.bind(this),
      this.onOpenNotification.bind(this),
    );

    localNotificationService.configure(this.onOpenNotification.bind(this));
  }

  onRegister = token => {
    console.log("home onRegister: ", token);
  };

  onNotification = async notify => {
    localNotificationService.localNotif()
    console.log("home onNotification");
  }

  onBackgroundNotification = async notify => {
    localNotificationService.localNotif()
    console.log("home onBackgroundNotification");
  }

  onOpenNotification = async notify => {
    console.log("home onOpenNotification");
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.heading}>ALARM</Text>
        <Pressable
          style={styles.buttonStyle}
          onPress={() => {
            //handleNotification(),
            console.log("Schedule Notification")
          }}>
          <Image
            source={require("./sourcefile/imgs/alarm-clock.png")}
            style={{ height: 60, width: 60 }}
          />
        </Pressable>

        <Text style={styles.heading}>Notification service</Text>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center'
  },
  heading: {
    fontSize: 25,
    padding: 20,
    color: 'black'
  },
  timePicker: {
    paddingTop: "10%",
    width: "50%",
    bottom: 20,
  },
  listAlarms: {
    flex: 1,
    width: "100%",
  },

  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 25,
  },

})

export default App;
