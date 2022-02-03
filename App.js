import { Image, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./screens/ChatScreen";
import RoomsScreen from "./screens/RoomsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Rooms">
        <Stack.Screen
          name="Rooms"
          component={RoomsScreen}
          options={{
            title: "Rooms",
            headerStyle: {
              backgroundColor: "#B6DEFD",
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              height: 100,
            },
            headerTintColor: "#5603AD",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 36,
            },
          }}
        />

        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            title: "ChatScreen",
            //lack of time - dynamic title props
            headerStyle: {
              backgroundColor: "#B6DEFD",
              borderBottomLeftRadius: 24,
              borderBottomRightRadius: 24,
              height: 100,
            },
            headerTintColor: "#5603AD",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 16,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
