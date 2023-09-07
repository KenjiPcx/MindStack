import { Navbar, Stack, Alert, Space, Text, ScrollArea } from "@mantine/core";
import { IconInfoCircleFilled } from "@tabler/icons-react";

interface AppNavbarProps {
  opened: boolean;
}
const AppNavbar = ({ opened }: AppNavbarProps) => (
  <Navbar
    p="md"
    hiddenBreakpoint="sm"
    hidden={!opened}
    width={{ sm: 300, lg: 300 }}
  >
    <ScrollArea>
      <Stack>
        <Alert
          icon={<IconInfoCircleFilled size="1rem" />}
          title="Why MindStack"
        >
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
            backlog will only appear after prioritized tasks are done to not
            distract you
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
          Only accessible through voice, but that't the most efficient way to
          use the app
        </Alert>
      </Stack>
    </ScrollArea>
  </Navbar>
);

export default AppNavbar;
