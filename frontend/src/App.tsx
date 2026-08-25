import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/Button";

interface UserInput {
  username: string;
  password: string;
  email: string;
  rememberMe: boolean;
}
interface User {
  username: string;
  passwordHash: string;
  email: string;
}
function App() {
  const [userInput, setUserInput] = useState<UserInput>({
    username: "",
    password: "",
    email: "",
    rememberMe: false,
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/users/me");
      const data = await response.json();
      setUser(data);
    };
    fetchUser();
  }, []);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(userInput),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setUser(data);
    console.log("render", user);
  }
  return (
    <>
      <h1>Welcome</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput.username}
          onChange={(e) =>
            setUserInput({ ...userInput, username: e.target.value })
          }
        />
        <input
          type="text"
          value={userInput.password}
          onChange={(e) =>
            setUserInput({ ...userInput, password: e.target.value })
          }
        />
        <input
          type="text"
          value={userInput.email}
          onChange={(e) =>
            setUserInput({ ...userInput, email: e.target.value })
          }
        />
        <input
          type="checkbox"
          checked={userInput.rememberMe}
          onChange={() =>
            setUserInput({ ...userInput, rememberMe: !userInput.rememberMe })
          }
        />
        <button>submit</button>
      </form>
      <h1>{user && user.username}</h1>
      <h1>{user && user.passwordHash}</h1>
      <h1>{user && user.email}</h1>
      <Button value="fart"></Button>
    </>
  );
}

export default App;
