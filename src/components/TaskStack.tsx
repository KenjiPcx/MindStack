import { ScrollArea, Stack } from "@mantine/core";
import { useState } from "react";

const TaskStack = () => {
  const [tasks, setTasks] = useState([]);

  const pushToStack = (task: string, priority: number = 0) => {};

  const popFromStack = () => {};

  const backlog = (task: string) => {};

  const clearStack = () => {};

  const clearBacklog = () => {};

  return (
    <ScrollArea>
      <Stack h={"100%"} align="center" justify="center"></Stack>
    </ScrollArea>
  );
};

export default TaskStack;
