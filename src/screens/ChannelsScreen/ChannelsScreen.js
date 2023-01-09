import { FlatList } from "react-native";
import ChatListItem from "../../components/ChatListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listChatRooms } from "./queries";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";


const ChannelsScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  const fetchChatRooms = async () => {
    setLoading(true);
    const authUser = await Auth.currentAuthenticatedUser();

    const response = await API.graphql(
      graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
    );

    const rooms = response?.data?.getUser?.ChatRooms?.items?.filter(
      (item) => !item._deleted && item.chatRoom.type === "CHANNEL"
    );

    const sortedRooms = rooms.sort(
      (r1, r2) =>
        new Date(r2.chatRoom.updatedAt) - new Date(r1.chatRoom.updatedAt)
    );

    setChatRooms(sortedRooms);
    setLoading(false);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const handleChatPress = (chatId) => {
    navigation.navigate("Thread", { id: chatId });
  };

  return (
    <FlatList
      data={chatRooms}
      renderItem={({ item }) => (
      <ChatListItem
        chat={item.chatRoom}
        profilePictureUrl={item.chatRoom.profilePictureUrl}
        onPress={handleChatPress}
        /> )}
      style={{ backgroundColor: "white" }}
      refreshing={loading}
      onRefresh={fetchChatRooms}
    />
  );
};

export default ChannelsScreen;

