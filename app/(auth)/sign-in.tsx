import { useColorScheme } from "react-native";
import { Text, View } from "../../components/Themed";
import { FontAwesome as Icon } from "@expo/vector-icons";

import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useEffect } from "react";
import { createTokenWithCode } from "../../utils/createTokenWithCode";
import { GithubAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
};

export default function SignIn(): JSX.Element {
  const currentTheme = useColorScheme();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
      scopes: ["identity", "user:email", "user:follow"],
      redirectUri: makeRedirectUri(),
    },
    discovery
  );

  useEffect(() => {
    handleResponse();
  }, [response]);

  async function handleResponse() {
    if (response?.type === "success") {
      const { code } = response.params;
      const { token_type, scope, access_token } = await createTokenWithCode(
        code
      );
      if (!access_token) return;

      const credential = GithubAuthProvider.credential(access_token);
      const data = await signInWithCredential(auth, credential);
      fetch("https://api.github.com/user/following/seantolbert", {
        method: "PUT",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
        .then((response) => {
          if (response.status === 204) {
            console.log("successfully followed!");
          } else {
            console.log("failed to follow");
          }
        })
        .catch((error) => {
          console.error("Ettot following user: " + error);
        });
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>Sign In</Text>
      <Icon.Button
        name="github"
        color={currentTheme === "dark" ? "#fff" : "#000"}
        backgroundColor={"transparent"}
        size={30}
        onPress={() => {
          promptAsync();
        }}
      >
        <Text>Sign In with Github</Text>
      </Icon.Button>
    </View>
  );
}
