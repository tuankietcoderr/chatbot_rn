import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppCommon } from "@/constants/common";
import { API } from "@/constants/api";

export const apiInstance = axios.create({
  baseURL: API.BASE,
});

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(AppCommon.ACCESS_TOKEN);
    return token;
  } catch (err) {
    throw err;
  }
};

export const getRequest = async (url: string, params?: any) => {
  try {
    const token = await getToken();
    const res = await apiInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...params,
    });
    return res.data;
  } catch (err: any) {
    throw err.response.data || err;
  }
};

export const postRequest = async (url: string, data?: any, params?: any) => {
  try {
    const token = await getToken();
    const res = await apiInstance.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...params,
    });
    return res.data;
  } catch (err: any) {
    throw err.response.data || err;
  }
};

export const putRequest = async (url: string, data: any, params?: any) => {
  try {
    const token = await getToken();
    const res = await apiInstance.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...params,
    });
    return res.data;
  } catch (err: any) {
    throw err.response.data || err;
  }
};

export const deleteRequest = async (url: string, params?: any) => {
  try {
    const token = await getToken();
    const res = await apiInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...params,
    });
    return res.data;
  } catch (err: any) {
    throw err.response.data || err;
  }
};
