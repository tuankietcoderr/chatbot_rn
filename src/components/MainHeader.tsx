import AppColors from "@/constants/color";
import AppFonts from "@/constants/font";
import AppFontSizes from "@/constants/font-size";
import AppRoutes from "@/constants/route";
import { useThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  navigation: NativeStackNavigationProp<any>;
  showChatList?: boolean;
};

const MainHeaderRight = ({ navigation, showChatList }: Props) => {
  const onPressChat = () => {
    navigation.push(AppRoutes.CHATS);
  };
  const onPressProfile = () => {
    navigation.push(AppRoutes.PROFILE);
  };
  const { theme } = useThemeContext();
  const isDarkTheme = theme === "dark";
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      {showChatList && (
        <TouchableOpacity onPress={onPressChat}>
          <Image
            source={require("@assets/icons/chat_list.png")}
            style={{
              width: 30,
              height: 30,
              tintColor: isDarkTheme
                ? AppColors.darkMode.black
                : AppColors.black,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onPressProfile}>
        <Ionicons
          name="person-outline"
          size={30}
          color={isDarkTheme ? AppColors.darkMode.black : AppColors.black}
        />
      </TouchableOpacity>
    </View>
  );
};

const MainHeaderTitle = () => {
  const { theme } = useThemeContext();
  const isDarkTheme = theme === "dark";
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Image
        source={require("@assets/logo/logo_4x.png")}
        style={{
          width: 40,
          height: 40,
        }}
        resizeMode="contain"
      />
      <Text
        style={{
          fontFamily: AppFonts.bold,
          fontSize: AppFontSizes.h4,
          color: AppColors.primary,
        }}
      >
        Chatbot
      </Text>
    </View>
  );
};

export { MainHeaderRight, MainHeaderTitle };
