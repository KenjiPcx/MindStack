import {
  Alert,
  AppShell,
  Burger,
  Center,
  Footer,
  Header,
  MantineProvider,
  MediaQuery,
  Navbar,
  Space,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { useState } from "react";

interface AppNavbarProps {
  opened: boolean;
}
const AppNavbar = ({ opened }: AppNavbarProps) => (
  <Navbar
    p="md"
    hiddenBreakpoint="sm"
    hidden={!opened}
    width={{ sm: 200, lg: 300 }}
  >
    <Stack>
      <Alert icon={<IconInfoCircleFilled size="1rem" />} title="Why MindStack">
        Endless notifications disrupting your workflow. If you got distracted,
        you struggle to remember previous tasks and you lose time in
        context-switching.
      </Alert>
      <Alert
        icon={<IconInfoCircleFilled size="1rem" />}
        title="Unlock your full potential"
        color="teal"
      >
        MindStack is your contextual stack visualizer, streamlining your tasks
        for optimal productivity.
        <Space />
        <Text mt={15}>
          <Text fw={700} component="span">
            Push to Stack, |task|, |priority|
          </Text>{" "}
          - Add task and its priority on the stack
        </Text>
        <Text mt={5}>
          <Text fw={700} component="span">
            Pop from Stack
          </Text>{" "}
          - Removes topmost task, say this when you finished the task
        </Text>
        <Text mt={5}>
          <Text fw={700} component="span">
            Backlog |task|
          </Text>{" "}
          - Specify a task to backlog, task can be in the stack or a new task,
          will appear after prioritized tasks are done
        </Text>
        <Text mt={5}>
          <Text fw={700} component="span">
            Clear |Stack or Backlog|
          </Text>{" "}
          - Removes all tasks from the stack or backlog
        </Text>
      </Alert>
      <Alert
        icon={<IconInfoCircleFilled size="1rem" />}
        title="Fully voice based"
        color="indigo"
      >
        Only accessible through voice, but that't the most efficient way to use
        the app
      </Alert>
    </Stack>
  </Navbar>
);

interface AppHeaderProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
const AppHeader = ({ opened, setOpened }: AppHeaderProps) => {
  const theme = useMantineTheme();
  return (
    <Header height={{ base: 50, md: 70 }} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text size="xl" fw="bold">
          MindStack
        </Text>
      </div>
    </Header>
  );
};

const AppFooter = () => {
  return (
    <Footer height={50} px="md" py="sm">
      <Center>
        <Text size="sm" color="dimmed">
          Phyciex Labs - 2023
        </Text>
      </Center>
    </Footer>
  );
};

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
        <Text>Resize app to see responsive navbar in action</Text>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
