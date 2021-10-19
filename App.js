/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import ConnectyCube from 'react-native-connectycube';

const CREDENTIALS = {
  appId: 5538,
  authKey: 'Qhge8fJ9RzxbFVT',
  authSecret: 'ygNNRFZqERqSXyS',
};
const CONFIG = {
  debug: {mode: 0}, // enable DEBUG mode (mode 0 is logs off, mode 1 -> console.log())
};
ConnectyCube.init(CREDENTIALS, CONFIG);

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [dialogId, setDialogId] = useState('');
  const [message, setMessage] = useState('');
  const [histories, setHistories] = useState([]);

  function handleChangeText(text) {
    setDialogId(text);
  }

  function handleChangeMessage(text) {
    setMessage(text);
  }

  useEffect(() => {
    (async () => {
      const userCredentials = {
        login: '60f8601304253d0ea243ff25',
        password: 'supersecurepwd',
      };

      await ConnectyCube.createSession(userCredentials)
        .then(session => {
          console.log('SESSION: ', session);
        })
        .catch(error => console.log('SESSION ERROR: ', error));

      const params = {
        type: 4,
        name: 'Blockchain trends',
      };

      const token = ConnectyCube.service.sdkInstance.session.token;
      console.log('CURRENT TOKEN: ', token);

      await ConnectyCube.chat
        .connect({userId: 5035626, password: token})
        .then(res => {
          // connected
          console.log('CONNECTED CHAT: ', res);
        })
        .catch(error => {
          console.log('Error CONNECTED CHAT: ', error);
        });

      await ConnectyCube.chat.dialog
        .create(params)
        .then(dialog => {
          console.log('DIALOG: ', dialog);
          setDialogId(dialog._id);
        })
        .catch(error => {
          console.log('ERROR: ', error);
        });

      ConnectyCube.chat.onMessageListener = onMessage;
    })();
  }, []);

  function onMessage(userId, message) {
    console.log(
      '[ConnectyCube.chat.onMessageListener] callback:',
      // userId,
      message,
    );
    setHistories(prev => [...prev, message.body]);
  }

  function handleSendMessage() {
    const _message = {
      type: 'groupchat',
      body: message,
      extension: {
        save_to_history: 1,
        dialog_id: dialogId,
      },
      markable: 1,
    };

    _message.id = ConnectyCube.chat.send(dialogId, _message);
  }
  async function handleConnectChat() {
    await ConnectyCube.chat.dialog
      .subscribe(dialogId)
      .then(dialog => {
        console.log('CONNECCTED TO CHAT: ', dialog);
      })
      .catch(error => {
        console.log('ERROR CONNECTED TO CHAT: ', error);
      });
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <TextInput
            onChangeText={handleChangeText}
            value={dialogId}
            style={{borderColor: '#000', borderWidth: 1, marginVertical: 20}}
            placeholder="Dialog ID"
          />
          <Button title="Connect to chat" onPress={handleConnectChat} />
          <TextInput
            onChangeText={handleChangeMessage}
            value={message}
            style={{borderColor: '#000', borderWidth: 1, marginVertical: 20}}
            placeholder="Message Content"
          />
        </View>
        <Button title="SEND" onPress={handleSendMessage} />
        <Text style={{marginTop: 20}}>Content</Text>
        {histories.map((h, index) => (
          <Text key={index}>{h}</Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
