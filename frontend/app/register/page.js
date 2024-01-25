import Background from "./background.js";
import Register from "./components/register.js";
import NodeList from "./components/nodeList.js";

export default function Home() {
  return (
    <>
      <Background>
        <Register />
        <NodeList />
      </Background>
    </>
  );
}
