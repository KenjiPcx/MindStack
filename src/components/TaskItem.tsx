import { Button, Text } from "@mantine/core";
import { AppTask } from "../types";

interface TaskItemProp {
  task: AppTask;
}

const TaskItem = ({ task }: TaskItemProp) => {
  const getBoxColor = () => {
    if (task.priority > 7) {
      return "violet";
    } else if (task.priority > 4) {
      return "indigo";
    } else if (task.priority > 1) {
      return "blue";
    } else {
      return "gray";
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
