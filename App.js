import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "./screens/ChatScreen";
import RoomsScreen from "./screens/RoomsScreen";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Rooms">
        <Stack.Screen name="Rooms" component={RoomsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
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
