import { Alert, Box, Image, ScrollArea, Stack, Text } from "@mantine/core";
import { useState } from "react";
import { AppTask } from "../types";

const mockTasks = [
  { task: "A", priority: 1 },
  { task: "B", priority: 2 },
  { task: "C", priority: 33 },
  { task: "D", priority: 4 },
];

const mockBacklog = [
  { task: "AA", priority: 1 },
  { task: "BV", priority: 2 },
  { task: "CD", priority: 33 },
  { task: "DS", priority: 4 },
];

const TaskStack = () => {
  const [tasks, setTasks] = useState<AppTask[]>(mockTasks);
  const [backlog, setBacklog] = useState<AppTask[]>([]);

  const pushTaskToStack = (task: string, priority: number = 0) => {
    setTasks((oldTasks) => {
      oldTasks.unshift({ task, priority });
      oldTasks.sort((a, b) => b.priority - a.priority);
      return oldTasks;
    });
  };

  const popTaskFromStack = () => {
    if (tasks.length == 0) return;
    setTasks((oldTasks) => oldTasks.slice(1));
  };

  const backlogTask = (task: string, priority: number = 0) => {
    setBacklog((oldBacklog) => {
      oldBacklog.unshift({ task, priority });
      oldBacklog.sort((a, b) => b.priority - a.priority);
      return oldBacklog;
    });
  };

  const popTaskFromBacklog = () => {
    if (backlog.length == 0) return;
    setTasks((oldBacklog) => oldBacklog.slice(1));
  };

  const clearStack = () => {
    setTasks([]);
  };

  const clearBacklog = () => {
    setBacklog([]);
  };

  return (
    <Stack h={"100%"} align="center" justify="center">
      {tasks.length > 0 ? (
        tasks.map((task, i) => <div>{task.task}</div>)
      ) : backlog.length > 0 ? (
        backlog.map((backlog, i) => <div>{backlog.task}</div>)
      ) : (
        <Box>
          <Image
            maw={250}
            mb={50}
            mx="auto"
            radius="md"
            src="/relax.jpg"
            alt="Random image"
          />
          <Alert>Empty tasks and backlog. Add some!</Alert>
        </Box>
      )}
    </Stack>
  );
};

export default TaskStack;
