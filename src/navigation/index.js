import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "react-native";

import ChatScreen from "../screens/ChatScreen/ChatScreen";
//import ChatsScreen from "../screens/ChatsScreen/ChatsScreen";
import ContactsScreen from "../screens/ContactsScreen";
import GroupInfoScreen from "../screens/GroupInfoScreen";
import NewGroupScreen from "../screens/NewGroupScreen";
import NewChannelScreen from "../screens/NewChannelScreen";
import AddContactsToGroupScreen from "../screens/AddContactsToGroupScreen";
import MainTabNavigator from "./MainTabNavigator";
import NewThreadScreen from "../screens/NewThreadScreen";
import ThreadScreen from "../screens/ThreadScreen/ThreadScreen";
//import ChannelsScreen from "../screens/ChannelsScreen/ChannelsScreen";


const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
  screenOptions={{ headerStyle: { backgroundColor: "whitesmoke" } }} >  
     <Stack.Screen
     name="Home"
     component={MainTabNavigator}
     options={{ headerShown: false }}
       />
             <Stack.Screen name="Chat" component={ChatScreen} 
              />
             <Stack.Screen name="Group Info" component={GroupInfoScreen} />
             <Stack.Screen name="Contacts"
       
               component={ContactsScreen}
             /*  options={{
                headerLeft: () => (
                <Button  title="Go back" onPress={() => navigation.navigate("Home")}
         />
       ),
     }} */               
  />
  <Stack.Screen name="New Group" component={NewGroupScreen} />
  <Stack.Screen name="New Channel" component={NewChannelScreen} />
  <Stack.Screen name="New Thread" component={NewThreadScreen} />
  <Stack.Screen name="Thread" component={ThreadScreen} />
  <Stack.Screen
    name="Add Contacts"
    component={AddContactsToGroupScreen} />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;