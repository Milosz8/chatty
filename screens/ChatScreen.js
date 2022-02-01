import { View, Text } from "react-native";
import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GiftedChat } from "react-native-gifted-chat";

const ChatScreen = (id) => {
  console.log(id);
  const chatId = id.route.params.chatID;
  console.log(chatId);
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

  const GET_MESSAGES = gql`
    query {
      room(id: "${chatId}") {
        messages {
          id
          body
          user {
            firstName
            lastName
          }
        }
      }
    }
  `;

  function GetTheMessage() {
    const { loading, error, data } = useQuery(GET_MESSAGES);
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error :(</Text>;
    console.log(data.room.messages);
    return data.room.messages.map(({ insertedAt, body }) => (
      <View key={insertedAt}>
        <Text>{insertedAt}</Text>
        <Text>{body}</Text>
      </View>
    ));
  }

  return (
    <ApolloProvider client={client}>
      <View>
        <Text>Chat</Text>
        <GetTheMessage />
      </View>
    </ApolloProvider>
  );
};

export default ChatScreen;