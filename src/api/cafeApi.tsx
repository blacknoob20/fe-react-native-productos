import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Casa Santa Rosa
// const baseURL = 'http://192.168.100.130:8080/api';
// Casa Duran
const baseURL = 'http://192.168.100.197:8080/api';

const cafeApi = axios.create({ baseURL });

cafeApi.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');

        if (token) config.headers!['x-token'] = token;

        return config;
    }
);

export default cafeApi;