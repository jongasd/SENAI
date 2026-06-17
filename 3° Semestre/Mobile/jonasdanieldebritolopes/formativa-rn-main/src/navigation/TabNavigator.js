import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// JONASDANIELDEBRITOLOPES

import ListaScreen from "../screens/ListaScreen";
import PerfilScreen from "../screens/PerfilScreen";
import StackNavigator from "./StackNavigator";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Musicas" component={StackNavigator}/>
        <Tab.Screen name="Lista" component={ListaScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}
