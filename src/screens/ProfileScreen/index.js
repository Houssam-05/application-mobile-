import { Text, TextInput, StyleSheet, Button } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogin } from "../../hooks/useLogin";
import useAuthContext from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";

const Profile = () => {
  const { login, error, isPending } = useLogin();
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  if (!user)
    return (
      <SafeAreaView>
        <Text style={styles.title}>Profile</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          style={styles.input}
        />
        <Button title="Save" onPress={() => login(email, password)} />
        <Text>{error} </Text>
        {isPending && <Text>Processing...</Text>}
      </SafeAreaView>
    );
  else {
    return (
      <SafeAreaView>
        <Text style={styles.title}>{user.email.slice(0, 4)}</Text>
        <Button title="Signout" onPress={() => logout()}>
          Sign out
        </Button>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  input: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 5,
  },
});

export default Profile;
