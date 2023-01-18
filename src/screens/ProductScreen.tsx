import React, { useContext, useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { };

export const ProductScreen = ({ navigation, route }: Props) => {
    const { id = '', name = '' } = route.params;
    const [tempUri, setTempUri] = useState<string>();
    const isDarkMode = useColorScheme() === 'dark';
    const { isLoading, categories } = useCategories();
    const { loadProductById, addProduct, updateProduct, uploadImage } = useContext(ProductsContext);
    const { _id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: '',
    });

    useEffect(() => {
        navigation.setOptions({
            title: nombre || 'Sin nombre del producto',
        });
    }, [nombre]);

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        if (id.length === 0) return;

        const product = await loadProductById(id);

        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre
        })
    }

    const saveOrUpdate = async () => {
        if (id.length > 0) {
            updateProduct(categoriaId, nombre, id);
        } else {
            const newProduct = await addProduct((categoriaId || categories[0]._id), nombre);
            onChange(newProduct._id, '_id');
        }
    }

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5,
        }, (resp) => {
            if (resp.didCancel) return;

            const [asset] = resp.assets || [];

            if (!asset.uri) return;

            setTempUri(asset.uri);
            uploadImage(resp, _id);
        });
    }

    const takePhotoFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.3,
        }, (resp) => {
            if (resp.didCancel) return;

            const [asset] = resp.assets || [];

            if (!asset.uri) return;

            setTempUri(asset.uri);
            uploadImage(resp, _id);
        });
    }


    // Estilos
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            marginTop: 10,
            marginHorizontal: 20
        },
        label: {
            fontSize: 18,
        },
        textInput: {
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            borderColor: (isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'),
            height: 45,
            marginTop: 5,
            marginBottom: 10,
        }
    });
    <Picker

    ></Picker>
    return (
        <View
            style={styles.container}
        >
            <ScrollView>
                <Text style={styles.label} >Nombre del producto:</Text>
                <TextInput
                    placeholder='Producto'
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={value => onChange(value, 'nombre')}
                />
                {/* Picker / Selector */}
                <Text style={styles.label} >Categoria:</Text>
                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(value) => onChange(value, 'categoriaId')}
                >
                    {
                        categories.map(
                            (c) => (
                                <Picker.Item
                                    key={c._id}
                                    label={c.nombre}
                                    value={c._id}
                                />
                            )
                        )
                    }
                </Picker>

                <Button title='Guardar' onPress={saveOrUpdate} color='#5856D6' />
                {
                    (_id.length > 0) && (
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <Button title='Camara' onPress={takePhoto} color='#5856D6' />
                            <View style={{ width: 10 }} />
                            <Button title='Galeria' onPress={takePhotoFromGallery} color='#5856D6' />
                        </View>
                    )
                }
                {/* TODO: Mostrar imagen temporal */}
                {
                    (tempUri) && (
                        <Image
                            source={{ uri: tempUri }}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300,
                            }}
                        />
                    )
                }
                {
                    (img.length > 0 && !tempUri) && (
                        <Image
                            source={{ uri: img }}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300,
                            }}
                        />
                    )
                }
            </ScrollView>
        </View>
    )
}