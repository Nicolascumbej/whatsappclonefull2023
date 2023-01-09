import React, { useState, useEffect } from "react";
import { FlatList, View, TextInput, StyleSheet, Button, Text } from "react-native";
import ContactListItem from "../components/ContactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listUsers } from "../graphql/queries";
import { createChatRoom, createUserChatRoom } from "../graphql/mutations";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";


import { useNavigation } from "@react-navigation/native";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);


  const handleProfilePictureSelection = async () => {
    // Open the device's image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
    });
    
    // Update the profilePicture state with the selected image
    if (!result.cancelled) {
      setProfilePicture(result.uri);
    }
  };

 


  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(result.data?.listUsers?.items);
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Create"
          disabled={!name || selectedUserIds.length < 1}
          onPress={onCreateGroupPress}
        />
      ),
    });
  }, [name, selectedUserIds]);

  const onCreateGroupPress = async () => {
    // Create a new Chatroom
    const newChatRoomData = await API.graphql(
      graphqlOperation(createChatRoom, { input: { name, type, profilePicture} })
    );
    if (!newChatRoomData.data?.createChatRoom) {
      console.log("Error creating the chat error");
    }
    const newChatRoom = newChatRoomData.data?.createChatRoom;

    // Add the selected users to the ChatRoom

    await Promise.all(
      selectedUserIds.map((userID) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomID: newChatRoom.id, userID },
          })
        )
      )
    );

    // Add the auth user to the ChatRoom
    const authUser = await Auth.currentAuthenticatedUser();
    await API.graphql(
      graphqlOperation(createUserChatRoom, {
        input: { chatRoomID: newChatRoom.id, userID: authUser.attributes.sub },
      })
    );

    setSelectedUserIds([]);
    setName("");
    // navigate to the newly created ChatRoom
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
    navigation.navigate("Chat", { id: newChatRoom.id });
  };

  const onContactPress = (id) => {
    setSelectedUserIds((userIds) => {
      if (userIds.includes(id)) {
        // remove id from selected
        return [...userIds].filter((uid) => uid !== id);
      } else {
        // add id to selected
        return [...userIds, id];
      }
    });
  };

  return (
    <View style={styles.container}>
       <TouchableOpacity onPress={handleProfilePictureSelection}>
        <Text>Select Profile Picture</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Group name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem
            user={item}
            selectable
            onPress={() => onContactPress(item.id)}
            isSelected={selectedUserIds.includes(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white" },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "lightgray",
    padding: 10,
    margin: 10,
  },
});

export default ContactsScreen;
