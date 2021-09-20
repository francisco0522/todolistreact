import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  ToastAndroid,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Button,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {useDispatch} from 'react-redux';
import {login} from '../Features/userSlice';
import auth from '@react-native-firebase/auth';

const Registro = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordState, setPasswordState] = useState(true);
  const textInput = useRef(null);

  useEffect(() => {}, []);

  const dispatch = useDispatch();

  const handleSubmit = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
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
          );
          setPassword('');
          setEmail('');
        }

        if (error.code === 'auth/email-already-in-use') {
          ToastAndroid.show(
            'El correo ' + email + ' ya se encuentra en uso',
            ToastAndroid.SHORT,
          );
          setPassword('');
          setEmail('');
        }
      });
  };

  async function onPressRegister() {
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

  function goToLogin() {
    navigation.navigate('Login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Registro</Text>

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
          //error={passwordError}
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
            onPressRegister();
          }}
        />
      </View>

      <Text>Ya tienes cuenta?</Text>
      <TouchableOpacity
        onPress={() => {
          goToLogin();
        }}>
        <Text style={styles.login}>Ingresa</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Registro;

const styles = EStyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 50,
    marginBottom: 10,
  },
  emailInput: {
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
    marginBottom: 50,
  },
  login: {
    color: 'blue',
  },
});
