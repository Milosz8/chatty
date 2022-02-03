import { View, Text } from "react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native-web";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const styles = StyleSheet.create({
  RoomsWrapper: {
    backgroundColor: "#5603AD",
    display: "flex",
    justifyContent: "center",
    padding: 30,
    marginTop: 40,
    borderRadius: 12,
  },
  TextDecoration: {
    color: "white",
  },
});

const httpLink = createHttpLink({
  uri: "https://chat.thewidlarzgroup.com/api/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token =
    "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaGF0bHkiLCJleHAiOjE2NDU1MjMyMDAsImlhdCI6MTY0MzEwNDAwMCwiaXNzIjoiY2hhdGx5IiwianRpIjoiY2Q0MDg5NjYtM2MyMC00MjVlLTg1YjQtZDJjNzdmZDljNGUzIiwibmJmIjoxNjQzMTAzOTk5LCJzdWIiOiI3MTkyNzZlMC03ODg5LTRlZTQtOTNlZi03N2VlYTFkZTRjMTciLCJ0eXAiOiJhY2Nlc3MifQ.LMqg9VsJwkas5UXiMZmV2CbILhlNP-bZIrF29P5sQnztvScT_siYwz7BqVzTBXeWRrEnlSa8YEF5_9ioyo6fMg";

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const GET_ROOMS = gql`
  query {
    usersRooms {
      rooms {
        id
        name
      }
      user {
        email
        firstName
        id
        lastName
        role
      }
    }
  }
`;

const GoToRoom = (roomId) => {
  console.log(roomId);
  return roomId;
};

const RoomsScreen = (props) => {
  const NavigateToChatScreen = (props, id) => {
    props.navigation.navigate("Chat", {
      chatID: id,
    });

    return id;
  };

  function GetTheRoom() {
    const { loading, error, data } = useQuery(GET_ROOMS);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error :(</Text>;
    return data.usersRooms.rooms.map(({ id, name }) => (
      <TouchableOpacity key={id}>
        <View key={id} style={styles.RoomsWrapper}>
          <Text
            key={id}
            style={styles.TextDecoration}
            onPress={() => NavigateToChatScreen(props, id)}
          >
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    ));
  }

  return (
    <ApolloProvider client={client}>
      <View>
        <GetTheRoom />
      </View>
    </ApolloProvider>
  );
};

export default RoomsScreen;
