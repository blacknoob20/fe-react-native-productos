import { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { ProtectedScreen } from '../screens/ProtectedScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { ProductsNavigator } from './ProductsNavigator';

const Stack = createStackNavigator();

export const Navigator = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const { status } = useContext(AuthContext);

    if (status === 'checking') return <LoadingScreen />;

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: (isDarkMode ? 'black' : 'white'),
                }
            }}
        >
            {
                (status !== 'authenticated')
                    ? (
                        <>
                            <Stack.Screen name='LoginScreen' component={LoginScreen} />
                            <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
                        </>
                    )
                    : (
                        <>
                            <Stack.Screen name='ProductsNavigator' component={ProductsNavigator} />
                            <Stack.Screen name='ProtectedScreen' component={ProtectedScreen} />
                        </>
                    )
            }
        </Stack.Navigator>
    )
}
