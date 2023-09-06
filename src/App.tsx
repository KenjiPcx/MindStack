import { AppShell, MantineProvider } from "@mantine/core";
import { useState } from "react";
import TaskStack from "./components/TaskStack";
import AppNavbar from "./components/AppNavbar";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

const App = () => {
  const [opened, setOpened] = useState(false);
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={<AppNavbar opened={opened} />}
        header={<AppHeader opened={opened} setOpened={setOpened} />}
        footer={<AppFooter />}
      >
        <TaskStack />
      </AppShell>
    </MantineProvider>
  );
};

export default App;
