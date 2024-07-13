import React from "react";
import { View, Image } from "react-native";

const TabIcon = ({ icon, focused }) => {
  return (
    <View>
      <Image
        source={icon}
        resizeMode="contain"
        style={{ height: 24, tintColor: focused ? "#2763ad" : "gray" }}
      />
    </View>
  );
};

export default TabIcon;
