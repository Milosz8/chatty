import { View, Text } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const ChatTest = (id) => {
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
  const SEND_MESSAGES = gql`
    mutation {
      sendMessage(
        body: "${messages}"
        roomId: "${chatId}"
      ) {
        id
      }
    }
  `;

  const getNewData = client
    .query({
      query: gql`
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
      `,
    })
    .then((result) => result?.data?.room?.messages);

  const getAllMessages = getNewData.then(function (result) {
    const newMessages = Object.keys(result).map((item, index) => {
      return {
        _id: result[item].id,
        text: result[item].body,
        createdAt: new Date(),
        user: {
          _id: item,
          name: `${result[item].user.firstName} ${result[item].user.lastName}`,
        },
      };
    });
    return newMessages;
  });
  console.log(getAllMessages);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    allMessages();
  }, []);
  const allMessages = async () => {
    const a = await getAllMessages;
    console.log(a);
    setMessages(a);
  };

  console.log(messages);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <ApolloProvider client={client}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </ApolloProvider>
  );
};

export default ChatTest;
