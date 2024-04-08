import messaging from '@react-native-firebase/messaging';
import {PERMISSIONS, request} from 'react-native-permissions';

class FCMService {
  #unregister;
  constructor() {
    this.#unregister = null;
  }
  //method was called to get FCM tiken for notification
  getFcmToken = async (onRegister) => {
    let token = null;
    await this.checkApplicationNotificationPermission();
    await this.registerAppWithFCM();
    try {
      token = await messaging().getToken();
      onRegister(token);
    } catch (error) {
      console.log('getFcmToken Device Token error ', error);
    }
    return token;
  }

  checkApplicationNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
    request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS)
      .then(result => {
        console.log('POST_NOTIFICATIONS status:', result);
      })
      .catch(error => {
        console.log('POST_NOTIFICATIONS error ', error);
      });
  }

  //method was called on  user register with firebase FCM for notification
  registerAppWithFCM = async () => {
    console.log(
      'registerAppWithFCM status',
      messaging().isDeviceRegisteredForRemoteMessages,
    );
    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging()
        .registerDeviceForRemoteMessages()
        .then(status => {
          console.log('registerDeviceForRemoteMessages status', status);
        })
        .catch(error => {
          console.log('registerDeviceForRemoteMessages error ', error);
        });
    }
  }

  //method was called on un register the user from firebase for stoping receiving notifications
  unRegisterAppWithFCM = async () => {
    console.log(
      'unRegisterAppWithFCM status',
      messaging().isDeviceRegisteredForRemoteMessages,
    );
  
    if (messaging().isDeviceRegisteredForRemoteMessages) {
      await messaging()
        .unregisterDeviceForRemoteMessages()
        .then(status => {
          console.log('unregisterDeviceForRemoteMessages status', status);
        })
        .catch(error => {
          console.log('unregisterDeviceForRemoteMessages error ', error);
        });
    }
    await messaging().deleteToken();
    console.log(
      'unRegisterAppWithFCM status',
      messaging().isDeviceRegisteredForRemoteMessages,
    );
  }

  registerListenerWithFCM = async (
    onNotification,
    onBackgroundNotification,
    onOpenNotification,
  ) => {
    this.#unregister = messaging().onMessage(async remoteMessage => {
      console.log('onMessage Received:' );
      if (remoteMessage) {
        onNotification(remoteMessage)
      }
    });
  
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('onNotificationOpenedApp Received');
      if (remoteMessage) {
        onOpenNotification(remoteMessage);
      }
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('setBackgroundMessageHandler Received:' );
      if(remoteMessage) {
        return onBackgroundNotification(remoteMessage);
      }
    })

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
  }

  unRegisterListenerWithFCM = () => {
    if (this.#unregister) {
      console.log('unRegisterListenerWithFCM');
      this.#unregister();
    }
  };
}

export const fcmService = new FCMService();