import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiInstance, getRequest, postRequest } from "@/api/instance";
import { AppCommon } from "@/constants/common";
import { IUser } from "@/schema/client/user";
import { API } from "@/constants/api";

const signIn = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const response = await postRequest(API.USER.SIGNIN, {
      username,
      password,
    });
    const data = response;
    await AsyncStorage.setItem(AppCommon.ACCESS_TOKEN, data.accessToken);
    return data;
  } catch (err) {
    return err;
  }
};

const signUp = async (user: IUser) => {
  try {
    const response = await postRequest(API.USER.SIGNUP, user);
    const data = response;
    await AsyncStorage.setItem(AppCommon.ACCESS_TOKEN, data.accessToken);
    return data;
  } catch (err: any) {
    return err;
  }
};

const signOut = async () => {
  try {
    await AsyncStorage.removeItem(AppCommon.ACCESS_TOKEN);
  } catch (err) {
    throw err;
  }
};

const getCurrentUser = async () => {
  try {
    const response = await getRequest(API.USER.BASE);
    return response;
  } catch (err) {
    return err;
  }
};

export { signIn, signOut, signUp, getCurrentUser };
