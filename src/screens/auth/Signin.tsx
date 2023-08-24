import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import MyTextInput from "@/components/MyTextInput";
import AppColors from "@/constants/color";
import AppRoutes from "@/constants/route";
import { EvilIcons } from "@expo/vector-icons";
import { AppCommon } from "@/constants/common";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { selectAuth } from "@/store/features/auth/auth-selector";
import { State } from "@/constants/state";
import { signInThunk } from "@/store/features/auth/auth-thunk";

const Signin = ({ navigation }: NativeStackScreenProps<any>) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <EvilIcons name="chevron-left" size={40} color="black" />
        </TouchableOpacity>
      ),
      headerShown: navigation.canGoBack(),
    });
  }, [navigation]);

  type SigninForm = {
    username: string;
    password: string;
  };

  const [form, setForm] = React.useState<SigninForm>({
    username: "",
    password: "",
  });

  const onInputChange = (text: string, name: keyof SigninForm) => {
    setForm({
      ...form,
      [name]: text,
    });
  };

  const onPressSignUpNow = () => {
    navigation.navigate(AppRoutes.SIGNUP);
  };

  const validateForm = (): boolean => {
    const { username, password } = form;
    if (!username) {
      alert("Username is required");
      return false;
    }
    if (!password) {
      alert("Password is required");
      return false;
    }
    return true;
  };

  const dispatch = useAppDispatch();
  const { status } = useAppSelector(selectAuth);
  const isLoading = status === State.LOADING;
  const onPressLetsGo = async () => {
    if (!validateForm()) return;
    dispatch(signInThunk(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const success = res.payload.success;
        if (success) {
          navigation.replace(AppRoutes.CHATS);
          navigation.reset({
            index: 0,
            routes: [{ name: AppRoutes.CHATS }],
          });
        } else {
          alert(res.payload.message);
        }
      }
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titleText}>Sign in</Text>
        <View>
          <MyTextInput
            label="Username"
            value={form.username}
            onChangeText={(text) => onInputChange(text, "username")}
            placeholder="Enter your username"
            autoFocus
          />
          <MyTextInput
            label="Password"
            value={form.password}
            onChangeText={(text) => onInputChange(text, "password")}
            placeholder="Enter your password"
            keyboardType="default"
            isPassword
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          style={[
            styles.signinBtn,
            {
              opacity: isLoading ? 0.5 : 1,
            },
          ]}
          disabled={isLoading}
          onPress={onPressLetsGo}
        >
          {isLoading && <ActivityIndicator color={AppColors.white} />}
          <Text style={styles.signinBtnText}>Let's go</Text>
        </TouchableOpacity>
        <View style={styles.signupContainer}>
          <Text style={styles.text}>No account yet? </Text>
          <TouchableOpacity onPress={onPressSignUpNow}>
            <Text style={styles.signupText}>Sign up now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    gap: 20,
    minHeight: AppCommon.SCREEN_HEIGHT,
  },
  titleText: {
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.h3,
    textAlign: "center",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: AppFonts.regular,
  },
  signupText: {
    fontFamily: AppFonts.regular,
    textDecorationColor: AppColors.primary,
    textDecorationLine: "underline",
    color: AppColors.primary,
  },
  signinBtn: {
    backgroundColor: AppColors.primary,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  signinBtnText: {
    color: AppColors.white,
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.body,
    textAlign: "center",
  },
});
