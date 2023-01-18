import { createContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cafeApi from '../api/cafeApi';
import { loginData, LoginResponse, RegisterData, Usuario } from '../interfaces/appInterface';
import { authReducer, AuthState } from './authReducer';

type AuthContextProps = {
    errorMsg: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: (registerData: RegisterData) => void;
    signIn: (loginData: loginData) => void;
    logOut: () => void;
    signRemoveError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMsg: '',
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(authReducer, authInitialState);

    useEffect(() => {
        checkToken()
    }, []);

    const checkToken = async () => {
        // Forma 1
        // AsyncStorage.getItem('token')
        //     .then(token => {
        //         console.log(token);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });

        // Forma 2
        const token = await AsyncStorage.getItem('token');

        if (!token) return dispatch({ type: 'notAuthenticated' });

        const resp = await cafeApi.get('/auth');

        if (resp.status !== 200) return dispatch({ type: 'notAuthenticated' });

        await AsyncStorage.setItem('token', resp.data.token);

        dispatch({
            type: 'signUp',
            payload: {
                token: resp.data.token,
                user: resp.data.usuario,
            }
        });

    }


    const signIn = async ({ correo, password }: loginData) => {
        try {
            const resp = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
            dispatch({
                type: 'signUp',
                payload: {
                    token: resp.data.token,
                    user: resp.data.usuario,
                }
            });

            console.log(resp.data);

            await AsyncStorage.setItem('token', resp.data.token);

        } catch (error: any) {
            console.log(error);
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Informacion incorrecta.'
            });
        }
    };
    const signUp = async ({ nombre, correo, password }: RegisterData) => {
        try {
            // const resp = await cafeApi.post<LoginResponse>('/auth/usuarios', [nombre, correo, password]);
            const resp = await cafeApi.post<LoginResponse>('/usuarios', { nombre, correo, password });
            dispatch({
                type: 'signUp',
                payload: {
                    token: resp.data.token,
                    user: resp.data.usuario,
                }
            });

            console.log(resp.data);


            await AsyncStorage.setItem('token', resp.data.token);

        } catch (error: any) {
            console.log(error);
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Problemas con el registro.'
            })

        }
    };
    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logOut' });
    };
    const signRemoveError = () => {
        dispatch({ type: 'removeError' });
    };


    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            signRemoveError,
        }}>
            {children}
        </AuthContext.Provider>
    );
}