import { Button, Text } from "@mantine/core";
import { AppTask } from "../types";

interface TaskItemProp {
  task: AppTask;
  type: "Stack" | "Backlog";
}

const TaskItem = ({ task, type }: TaskItemProp) => {
  const getBoxColor = () => {
    if (type === "Stack") {
      if (task.priority > 7) {
        return "violet";
      } else if (task.priority > 4) {
        return "indigo";
      } else {
        return "blue";
      }
    } else {
      if (task.priority > 7) {
        return "teal";
      } else if (task.priority > 4) {
        return "lime";
      } else {
        return "gray";
      }
    }
  };

  return (
    <Button
      variant="light"
      color={getBoxColor()}
      maw={"90%"}
      size="lg"
      sx={{
        textAlign: "center",
      }}
    >
      <Text truncate>{task.task}</Text>
    </Button>
  );
};

export default TaskItem;
