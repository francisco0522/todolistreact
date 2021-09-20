import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  ToastAndroid,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Button,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Icon} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import {logout, selectUser} from '../Features/userSlice';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const TodoList = () => {
  const user = useSelector(selectUser);
  const navigation = useNavigation();
  const [ToDo, setToDo] = useState('');
  const textInput = useRef(null);
  const [list, setList] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('List')
      .doc(user.email)
      .onSnapshot(documentSnapshot => {
        setList(documentSnapshot.data()['key']);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);



  const dispatch = useDispatch();

  const handleSubmit = () => {
    auth()
      .signOut()
      .then(
        () => dispatch(logout()),
        ToastAndroid.show('El usuario salio', ToastAndroid.SHORT),
        navigation.navigate('Login'),
      );
  };

  async function onPressLogout() {
    handleSubmit();
  }

  async function addItem() {

    const newList = list
    newList.push(ToDo)
    firestore()
    .collection('List')
    .doc(user.email)
    .set({
      key: newList,
    })
    .then(() => {
      ToastAndroid.show('Se añadio ' + ToDo + ' a tu lista', ToastAndroid.SHORT);
    });
  }

  async function removeItem(i) {

    const newList = list
    newList.splice(i, 1)
    firestore()
    .collection('List')
    .doc(user.email)
    .set({
      key: newList,
    })
    .then(() => {
      ToastAndroid.show('Se elimino ' + ToDo + ' de tu lista', ToastAndroid.SHORT);
    });
  }


  async function removeList() {

    firestore()
    .collection('List')
    .doc(user.email)
    .delete()
    .then(() => {
      console.log('Lista eliminada');
    });
  }

  

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.button}>
          <Button
            title="Logout"
            onPress={() => {
              onPressLogout();
            }}
          />
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.headerText}>TodoList</Text>

        <View style={styles.view}>
          <TextInput
            onChangeText={text => setToDo(text)}
            value={ToDo}
            inlineImageLeft="ToDo"
            placeholder="Ingresar tu nuevo item"
            placeholderTextColor="#9097a5"
            mode="outlined"
            label={'Nuevo Item'}
            style={styles.todoInput}
            ref={textInput}
          />
          <View style={styles.buttonAdd}>
            <Button
              title="+"
              onPress={() => {
                addItem();
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.list}>
        {list &&
          list.length > 0 &&
          list.map((data, i) => (
            <View style={styles.items}>
              <Text style={styles.item}>{data}
              </Text>
              <Button
                color='red'
                title="x"
                onPress={() => {
                  removeItem(i);
                }}
              />
            </View>
          ))}
      </View>
    </View>
  );
};

export default TodoList;

const styles = EStyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 70,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    paddingTop: 70,
    
  },
  items: {
    width: '95%',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#DADADA',
    justifyContent: 'space-between',
    marginBottom:10,
  },
  item: {
    fontSize: 30,
    paddingLeft: 20,
    
  },
  headerText: {
    fontSize: 50,
    marginBottom: 10,
  },
  todoInput: {
    borderColor: '#e8eef4',
    borderRadius: 10,
    borderWidth: '1rem',
    color: '#9097a5',
    paddingLeft: '25rem',
    alignItems: 'center',
    paddingRight: '60rem',
    height: '40rem',
  },
  view: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
    height: 60,
  },
  button: {
    width: '20%',
    marginBottom: 10,
  },
  buttonAdd: {
    width: '10%',
    height: '55rem',
    justifyContent: 'center',
  },
});
