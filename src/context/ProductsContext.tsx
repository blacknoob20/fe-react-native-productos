import { createContext, useEffect, useState } from 'react';
import { ImagePickerResponse } from 'react-native-image-picker';
import cafeApi from '../api/cafeApi';
import { Producto, ProductsResponse } from '../interfaces/appInterface';

type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>;
}

export const ProductsContext = createContext({} as ProductsContextProps);

export const ProductsProvider = ({ children }: any) => {
    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts();
    }, [])

    const loadProducts = async () => {
        const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
        // setProducts([...products, ...resp.data.productos]);
        setProducts([...resp.data.productos]);
        // console.log(products);

    }

    const addProduct = async (categoryId: string, productName: string): Promise<Producto> => {
        const resp = await cafeApi.post<Producto>('/productos', {
            nombre: productName,
            categoria: categoryId,
        });

        setProducts([...products, resp.data]);

        return resp.data;
    }

    const updateProduct = async (categoryId: string, productName: string, productId: string) => {
        console.log(`/productos/${productId}`);

        const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
            nombre: productName,
            categoria: categoryId,
        });

        setProducts(products.map(prod => (prod._id === productId ? resp.data : prod)));
    }

    const deleteProduct = async (id: string) => { }

    const loadProductById = async (id: string): Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`/productos/${id}`);

        return resp.data;
    }

    const uploadImage = async (data: ImagePickerResponse, id: string) => {
        const [asset] = data.assets || [];
        const fileToUpload = {
            uri: asset?.uri,
            type: asset?.type,
            name: asset?.fileName,
        };

        const formData = new FormData();
        formData.append('archivo', fileToUpload);

        try {
            const response = await fetch(`http://192.168.100.197:8080/api/uploads/productos/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(JSON.stringify(response,null,5),'OK');
        } catch (error) {
            console.log(JSON.stringify(error,null,5),'Error');
        };
    }

    // No funciona con AXIOS
    // const uploadImage = async (data: ImagePickerResponse, id: string) => {
    //     const [asset] = data.assets || [];
    //     const fileToUpload = {
    //         uri: asset?.uri,
    //         type: asset?.type,
    //         name: asset?.fileName,
    //     };

    //     const formData = new FormData();
    //     formData.append('archivo', fileToUpload);

    //     try {
    //         // console.log(JSON.stringify(fileToUpload, null, 5));

    //         const resp = await cafeApi.put(`/uploads/productos/${id}`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });

    //         console.log(JSON.stringify(resp, null, 5), 'Linea 78');

    //     } catch (error) {
    //         console.log(JSON.stringify(error, null, 5));
    //         // console.log(error);
    //     }
    // }

    return (
        <ProductsContext.Provider value={{
            products,
            loadProducts,
            addProduct,
            updateProduct,
            deleteProduct,
            loadProductById,
            uploadImage,
        }}>
            {children}
        </ProductsContext.Provider>
    )
}