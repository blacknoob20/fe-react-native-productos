import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ProductsContext } from '../context/ProductsContext';
import { ProductsStackParams } from '../navigator/ProductsNavigator';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> { };

export const ProductsScreen = ({ navigation }: Props) => {
    const isDarkMode = useColorScheme() === 'dark';
    const { products, loadProducts } = useContext(ProductsContext);
    const [isRefreshing, setIsRefreshing] = useState(true);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.4}
                    style={{
                        marginRight: 10,
                    }}
                    onPress={() => navigation.navigate('ProductScreen', {})}
                >
                    <Text>Agregar</Text>
                </TouchableOpacity>
            )
        });
    }, []);

    useEffect(() => {
        if (products.length > 0) setIsRefreshing(false);
    }, [products]);


    const loadProductsFromBackend = async () => {
        loadProducts();
    }

    const styles = StyleSheet.create({
        productName: {
            fontSize: 20,
        },
        itemSeparator: {
            borderBottomWidth: 5,
            borderBottomColor: (isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'),
            marginVertical: 5,
        },
    });

    return (
        <View
            style={{
                flex: 1,
                marginHorizontal: 10,
            }}
        >
            <FlatList
                data={products}
                keyExtractor={p => p._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.4}
                        onPress={() => navigation.navigate('ProductScreen', {
                            id: item._id,
                            name: item.nombre
                        })}
                    >
                        <Text style={styles.productName}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (<View style={styles.itemSeparator} />)}
                refreshing={isRefreshing}
                onRefresh={loadProductsFromBackend}
            />
        </View>
    )

}
