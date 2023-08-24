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
import { IUser } from "@/schema/client/user";
import { AppCommon } from "@/constants/common";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { signUpThunk } from "@/store/features/auth/auth-thunk";
import { selectAuth } from "@/store/features/auth/auth-selector";
import { State } from "@/constants/state";

const Signup = ({ navigation }: NativeStackScreenProps<any>) => {
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

  type SignupForm = IUser & {
    confirmPassword: string;
  };

  const [form, setForm] = React.useState<SignupForm>({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const onInputChange = (text: string, name: keyof SignupForm) => {
    setForm({
      ...form,
      [name]: text,
    });
  };

  const onPressSignInNow = () => {
    navigation.replace(AppRoutes.SIGNIN);
    navigation.reset({
      index: 0,
      routes: [{ name: AppRoutes.SIGNIN }],
    });
  };

  const validateForm = (): boolean => {
    const { fullName, username, password, confirmPassword } = form;

    if (!fullName) {
      alert("Full name is required");
      return false;
    }

    if (!username) {
      alert("Username is required");
      return false;
    }

    if (username.length < 6) {
      alert("Username must be at least 6 characters");
      return false;
    }

    const usernameRegex = new RegExp("^\\w[\\w.]{2,18}\\w$");
    if (!usernameRegex.test(username)) {
      alert("Username must be alphanumeric");
      return false;
    }

    if (!password) {
      alert("Password is required");
      return false;
    }

    const passwordRegex = new RegExp(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
    );

    if (!passwordRegex.test(password)) {
      alert(
        "Password must be 8-16 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      return false;
    }

    if (password !== confirmPassword) {
      alert("Password and confirm password must be the same");
      return false;
    }
    return true;
  };

  const dispatch = useAppDispatch();
  const { status } = useAppSelector(selectAuth);
  const isLoading = status === State.LOADING;

  const onPressSignUp = async () => {
    if (!validateForm()) return;
    dispatch(signUpThunk(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        if (res.payload.success) {
          alert("Sign up successfully. Sign in now");
          navigation.replace(AppRoutes.SIGNIN);
          navigation.reset({
            index: 0,
            routes: [{ name: AppRoutes.SIGNIN }],
          });
        } else {
          alert(res.payload.message);
        }
      } else {
        alert("Sign up failed");
      }
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.titleText}>Sign up</Text>
        <View>
          <MyTextInput
            label="Full name"
            value={form.fullName}
            onChangeText={(text) => onInputChange(text, "fullName")}
            placeholder="Enter your full name"
            autoFocus
            autoComplete="name"
          />
          <MyTextInput
            label="Username"
            value={form.username}
            onChangeText={(text) => onInputChange(text, "username")}
            placeholder="Enter your username"
            autoComplete="username"
            keyboardType="default"
          />
          <MyTextInput
            label="Password"
            value={form.password}
            onChangeText={(text) => onInputChange(text, "password")}
            placeholder="Enter your password"
            secureTextEntry
            autoComplete="password"
            keyboardType="default"
            isPassword
          />
          <MyTextInput
            label="Confirm password"
            value={form.confirmPassword}
            onChangeText={(text) => onInputChange(text, "confirmPassword")}
            placeholder="Re-enter your password"
            secureTextEntry
            keyboardType="default"
            isPassword
          />
        </View>
        <TouchableOpacity
          style={[
            styles.signupBtn,
            {
              opacity: isLoading ? 0.5 : 1,
            },
          ]}
          onPress={onPressSignUp}
          disabled={isLoading}
        >
          {isLoading && <ActivityIndicator color={AppColors.white} />}
          <Text style={styles.signupBtnText}>Become a Chatbot's user</Text>
        </TouchableOpacity>
        <View style={styles.signinContainer}>
          <Text style={styles.text}>Already have an account? </Text>
          <TouchableOpacity onPress={onPressSignInNow} disabled={isLoading}>
            <Text style={styles.signupText}>Sign in now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Signup;

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
    marginHorizontal: 20,
  },
  signinContainer: {
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
  signupBtn: {
    backgroundColor: AppColors.primary,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  signupBtnText: {
    color: AppColors.white,
    fontFamily: AppFonts.bold,
    fontSize: AppFontSizes.body,
    textAlign: "center",
  },
});
