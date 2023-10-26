import { Button, StyleSheet, Image } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { useAuth } from "../../context/auth";

export default function TabOneScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.photoURL }}
        style={{ width: 200, height: 200 }}
      />
      <Text style={styles.title}>{user?.displayName}</Text>
      <Text style={styles.title}>{user?.providerId}</Text>
      <Text style={styles.title}>{user?.email}</Text>
      <Button title="sign out" onPress={signOut} />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
