import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  ToastAndroid,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  useColorScheme
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {useDispatch} from 'react-redux';
import {login} from '../Features/userSlice';
import auth from '@react-native-firebase/auth';


const Login = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordState, setPasswordState] = useState(true);
  const textInput = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [color, setColor] = useState('');

  useEffect(() => {
    setColor(colorScheme)
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const dispatch = useDispatch();

  const handleSubmit = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        dispatch(
          login({
            email: email,
            password: password,
            loggedIn: true,
          }),
        );
        navigation.navigate('TodoList');
        ToastAndroid.show('Bienvenido ' + email, ToastAndroid.SHORT);
        setPassword('');
        setEmail('');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-email') {
          ToastAndroid.show(
            'El correo ' + email + ' es invalido',
            ToastAndroid.SHORT,
            setPassword(''),
            setEmail(''),
          );
        }

        if (error.code === 'auth/wrong-password') {
          ToastAndroid.show('La contraseña es incorrecta', ToastAndroid.SHORT);
          setPassword(''), setEmail('');
        }
      });
  };

  async function onPressLogin() {
    const emailLower = email.toLowerCase();
    var expReg =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    var esValido = expReg.test(emailLower);
    textInput.current.clear();
    if (!esValido) {
      ToastAndroid.show(
        'El email que ingreso no es valido',
        ToastAndroid.SHORT,
      );
    } else if (password == '') {
      ToastAndroid.show(
        'El campo de contraseña esta vacio',
        ToastAndroid.SHORT,
      );
    } else {
      handleSubmit();
    }
  }


  function goToRegister() {
    navigation.navigate('Registro');
  }

  return (
    
    <View style={color == "light" ? styles.page : styles.pageDark}>
      <View style={styles.colorPage}>
        {color == "light" ? (
        <TouchableOpacity
        onPress={() => {
          setColor("dark")
        }}>
          <Text>
          ☀️
          </Text>
        </TouchableOpacity>
        ):(
          <TouchableOpacity
          onPress={() => {
            setColor("light")
          }}>
          <Text>
          🌙
          </Text>
        </TouchableOpacity>
        )}
      </View>
      <View style={ color == "light" ? styles.container : styles.containerDark}>
      <Text style={styles.headerText}>TodoList</Text>
      <View style={styles.view}>
        <TextInput
          onChangeText={text => setEmail(text)}
          value={email}
          inlineImageLeft="mail"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCompleteType="email"
          placeholder="Ingresar Email"
          placeholderTextColor="#9097a5"
          mode="outlined"
          label={'Correo electronico'}
          style={styles.emailInput}
          ref={textInput}
        />
      </View>

      <View style={styles.view}>
        <TextInput
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={passwordState}
          textContentType="password"
          mode="outlined"
          label={'Contraseña'}
          placeholder="Ingresar Contraseña"
          placeholderTextColor="#9097a5"
          style={styles.passwordInput}
          ref={textInput}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Login"
          onPress={() => {
            onPressLogin();
          }}
        />
      </View>
    

      <Text>No tienes cuenta?</Text>
      <TouchableOpacity
        onPress={() => {
          goToRegister();
        }}>
        <Text style={styles.register}>Registrate</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default Login;

const styles = EStyleSheet.create({
  page:{
    backgroundColor: '#fff',
  },
  pageDark:{
    backgroundColor: '#000',
  },
  colorPage:{
    paddingLeft: 10,
    marginTop: 10
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  containerDark: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  headerText: {
    color: "black",
    fontSize: 50,
    marginBottom: 10,
  },
  headerTextDark: {
    color: "white",
    fontSize: 50,
    marginBottom: 10,
  },
  emailInput: {
    borderColor: '#C9CED3',
    borderRadius: 10,
    borderWidth: '1rem',
    color: '#9097a5',
    paddingLeft: '25rem',
    alignItems: 'center',
    paddingRight: '60rem',
    height: '55rem',
  },
  emailInputDark: {
    borderColor: '#e8eef4',
    borderRadius: 10,
    borderWidth: '1rem',
    color: '#9097a5',
    paddingLeft: '25rem',
    alignItems: 'center',
    paddingRight: '60rem',
    height: '55rem',
  },
  passwordInput: {
    borderColor: '#C9CED3',
    borderRadius: 10,
    borderWidth: '1rem',
    color: '#9097a5',
    paddingLeft: '25rem',
    alignItems: 'center',
    paddingRight: '60rem',
    height: '55rem',
  },
  passwordInputDark: {
    borderColor: '#e8eef4',
    borderRadius: 10,
    borderWidth: '1rem',
    color: '#9097a5',
    paddingLeft: '25rem',
    alignItems: 'center',
    paddingRight: '60rem',
    height: '55rem',
  },
  view: {
    width: '80%',
    marginTop: 20,
    height: 60,
  },
  button: {
    width: '80%',
    marginTop: 40,
    marginBottom: 10,
  },
  register: {
    color: 'blue',
  },
});
