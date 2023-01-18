import React from 'react';
import { useColorScheme } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ProductScreen } from '../screens/ProductScreen';

export type ProductsStackParams = {
    ProductsScreen: undefined;
    ProductScreen: { id?: string, name?: string };
}

const Stack = createStackNavigator<ProductsStackParams>();

export const ProductsNavigator = () => {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: { color: (isDarkMode ? 'white' : 'black'), },
                headerStyle: {
                    backgroundColor: (isDarkMode ? 'black' : 'white'),
                    elevation: 0,
                    shadowColor: 'transparent',
                },
                cardStyle: {
                    backgroundColor: (isDarkMode ? 'black' : 'white'),
                }
            }}
        >
            <Stack.Screen
                name='ProductsScreen'
                component={ProductsScreen}
                options={{ title: 'Productos' }}
            />
            <Stack.Screen
                name='ProductScreen'
                component={ProductScreen}
            />
        </Stack.Navigator>
    )
}
