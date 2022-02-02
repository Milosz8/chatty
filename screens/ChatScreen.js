import { View, Text } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
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

  const SEND_MESSAGE = gql`
    mutation {
      sendMessage(
        body: "${messages}"
        roomId: "${chatId}"
      ) {
        id
      }
    }
  `;

  const GET_MESSAGES = gql`
    query {
      room(id: "${chatId}") {
        messages {
          id
          body
          insertedAt
          user {
            firstName
            lastName
          }
        }
      }
    }
  `;

  // function SendMessage() {
  //   const { loading, error, data } = useQuery(SEND_MESSAGE, {

  //     pollInterval: 500,
  //   });

  //   if (loading) return null;
  //   if (error) return `Error! ${error}`;

  //   return (
  //     <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
  //   );
  // }

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
          _id: index, // to fix propper user id
          name: `${users[index].user.firstName} ${users[index].user.lastName}`,
        },
      };
    });

    users.forEach(function (item, index) {
      console.log(users[index].user.firstName);
    });

    const messagesList = data.room.messages.map(({ id, body, user }) => (
      <View key={id}>
        <Text>{user.firstName + " " + user.lastName}</Text>
        <Text>{body}</Text>
      </View>
    ));

    console.log("dupa", usersArray);

    return (
      <GiftedChat
        messages={usersArray}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // allMessages();
  }, []);
  const allMessages = async () => {
    // const a = await getAllMessages;
    // console.log(a);
    // setMessages(a);
  };

  console.log(messages);

  //sending message

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <ApolloProvider client={client}>
      {/* <Text>Chat</Text> */}

      <GetTheMessage />
    </ApolloProvider>
  );
};

export default ChatScreen;
