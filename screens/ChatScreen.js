import { Text } from "react-native";
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
  const chatId = id.route.params.chatID;
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
          insertedAt
          user {
            id
            firstName
            lastName
          }
        }
      }
    }
  `;

  function SendTheMessage(messages) {
    //messages always gets [0]
    const msg = messages[0].text;
    const sendTheMessage = client.mutate({
      mutation: gql`
      mutation {
        sendMessage(
          body: "${msg}"
          roomId: "${chatId}"
        ) {
          id
        }
      }
    `,
    });
  }

  function GetTheMessage() {
    const { loading, error, data } = useQuery(GET_MESSAGES, {
      pollInterval: 500,
    });
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error :(</Text>;
    const users = data.room.messages;
    const usersArray = Object.keys(users).map((index) => {
      return {
        _id: users[index].id,
        text: users[index].body,
        createdAt: users[index].insertedAt,
        user: {
          _id: users[index].user.id,
          name: `${users[index].user.firstName} ${users[index].user.lastName}`,
        },
      };
    });

    return (
      <GiftedChat
        messages={usersArray}
        showAvatarForEveryMessage={true}
        onSend={(messages) => SendTheMessage(messages)}
        user={{
          _id: "719276e0-7889-4ee4-93ef-77eea1de4c17",
        }}
        //user id value from login screen (if implemented)
      />
    );
  }

  return (
    <ApolloProvider client={client}>
      <GetTheMessage />
    </ApolloProvider>
  );
};

export default ChatScreen;
