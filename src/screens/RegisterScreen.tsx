import { useContext, useEffect } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { WhiteLogo } from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../themes/loginTheme';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> { };

export const RegisterScreen = ({ navigation }: Props) => {
    const { signUp, signRemoveError, errorMsg } = useContext(AuthContext);
    const { name, email, password, onChange } = useForm({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        if (errorMsg.length === 0) return;

        Alert.alert('Login incorrecto', errorMsg, [{ text: 'OK', onPress: signRemoveError }]);

    }, [errorMsg]);

    const onRegister = () => {
        console.log({ name, email, password });
        Keyboard.dismiss();
        signUp({ nombre: name, correo: email, password });
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    backgroundColor: '#5856D6',
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={loginStyles.formContainer}>
                    {/* keyboard avoid view */}
                    <WhiteLogo />

                    <Text style={loginStyles.title}>Registro</Text>

                    <Text style={loginStyles.label}>Nombre</Text>
                    <TextInput
                        placeholder='Ingrese su nombre'
                        underlineColorAndroid={'white'}
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor={'white'}
                        onChangeText={(value) => onChange(value, 'name')}
                        value={name}
                        onSubmitEditing={onRegister}
                        autoCapitalize={'words'}
                        autoCorrect={false}
                    />

                    <Text style={loginStyles.label}>Email</Text>
                    <TextInput
                        placeholder='Ingrese su email'
                        keyboardType='email-address'
                        underlineColorAndroid={'white'}
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor={'white'}
                        onChangeText={(value) => onChange(value, 'email')}
                        value={email}
                        onSubmitEditing={onRegister}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                    />

                    {/* OJO: La posision de secureTextEntry debe ser antes de keyboardType */}
                    <Text style={loginStyles.label}>Clave</Text>
                    <TextInput
                        placeholder='*****'
                        secureTextEntry
                        keyboardType={'default'}
                        underlineColorAndroid={'white'}
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS
                        ]}
                        selectionColor={'white'}
                        onChangeText={(value) => onChange(value, 'password')}
                        value={password}
                        onSubmitEditing={onRegister}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                    />

                    {/* Boton login */}
                    <View
                        style={loginStyles.buttonContainer}
                    >
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={loginStyles.button}
                            onPress={onRegister}
                        >
                            <Text style={loginStyles.buttonText} >Crear cuenta</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Boton regresar al login */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.replace('LoginScreen')}
                        style={loginStyles.buttonReturn}
                    >
                        <Text style={loginStyles.buttonText}>Login</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </>
    );
}
