import { Alert, Box, Button, Center, Image, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { AppTask } from "../types";
import {
  SpeechConfig,
  SpeechRecognizer,
  AudioConfig,
} from "microsoft-cognitiveservices-speech-sdk";
import { IconCheck, IconMicrophone, IconX } from "@tabler/icons-react";
import TaskItem from "./TaskItem";
import {
  AssistantResponse,
  getOpenaiResponse,
  populatePrompt,
} from "../openaiClient";

const speechConfig = SpeechConfig.fromSubscription(
  import.meta.env.VITE_AZURE_SPEECH_RECOGNITION_KEY,
  import.meta.env.VITE_AZURE_REGION
);
speechConfig.speechRecognitionLanguage = "en-US";

const taskDisplayLimit = 3;

const TaskStack = () => {
  const [tasks, setTasks] = useState<AppTask[]>(
    JSON.parse(localStorage.getItem("tasks")!) || []
  );
  const [backlog, setBacklog] = useState<AppTask[]>(
    JSON.parse(localStorage.getItem("backlog")!) || []
  );
  const [transcript, setTranscript] = useState<string>("");
  const [transcriptVisible, setTranscriptVisible] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);

  const recognizeSpeech = () => {
    setRecording(true);
    showNotification({
      id: "transcript",
      title: "Transcriber activated",
      message: "Voice is being transcribed",
    });
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
    speechRecognizer.recognizeOnceAsync(
      (res) => {
        setTranscript(res.text);
        setRecording(false);
        showSuccessNotification({
          id: "transcript",
          message: "Transcription complete",
        });
      },
      (err) => {
        console.error(err);
      }
    );
  };

  // Core stack data structure
  const pushTaskToStack = (task: string, priority: number = 0) => {
    if (tasks.length >= taskDisplayLimit) {
      const poppedTask = tasks.pop();
      pushTaskToBacklog(poppedTask!.task, poppedTask!.priority);
    }
    setTasks((oldTasks) =>
      [{ task, priority }, ...oldTasks].sort((a, b) => b.priority - a.priority)
    );
  };

  const popTaskFromStack = () => {
    if (tasks.length == 0) return;
    setTasks((oldTasks) => oldTasks.slice(1));

    if (backlog.length > 0) {
      const poppedBacklogTask = popTaskFromBacklog();
      pushTaskToStack(poppedBacklogTask!.task, 0);
    }
  };

  const pushTaskToBacklog = (task: string, priority: number = 0) => {
    setBacklog((oldBacklog) =>
      [{ task, priority }, ...oldBacklog].sort(
        (a, b) => b.priority - a.priority
      )
    );
  };

  const popTaskFromBacklog = () => {
    if (backlog.length == 0) return;
    const poppedTask = backlog[0];
    setBacklog((oldBacklog) => oldBacklog.slice(1));
    return poppedTask;
  };

  const clearStack = () => {
    setTasks([]);
  };

  const clearBacklog = () => {
    setBacklog([]);
  };
  // End of data structure

  // Notifications
  const showNotification = ({
    id,
    title,
    message,
  }: {
    id: string;
    title: string;
    message: string;
  }) => {
    notifications.show({
      id: id,
      loading: true,
      title: title,
      message: message,
      autoClose: false,
      withCloseButton: false,
      styles: () => ({
        root: { marginTop: 60 },
      }),
    });
  };

  const showFailureNotification = ({
    id,
    message,
  }: {
    id: string;
    message: string;
  }) => {
    notifications.update({
      id: id,
      color: "red",
      title: "I don't understand",
      message: message,
      icon: <IconX size="1rem" />,
      autoClose: 5000,
      styles: () => ({
        root: { marginTop: 60 },
      }),
    });
  };

  const showSuccessNotification = ({
    id,
    message,
  }: {
    id: string;
    message: string;
  }) => {
    notifications.update({
      id: id,
      color: "green",
      title: "Done",
      message: message,
      icon: <IconCheck size="1rem" />,
      autoClose: 5000,
      styles: () => ({
        root: { marginTop: 60 },
      }),
    });
  };
  // End of notifications

  const handleAssistantCalls = (res: AssistantResponse) => {
    if (!res.functionToCall) return;

    switch (res.functionToCall) {
      case "pushTaskToStack":
        console.log("Here");
        if (res.functionParams) {
          pushTaskToStack(res.functionParams.task, res.functionParams.priority);
        }
        break;
      case "popTaskFromStack":
        popTaskFromStack();
        break;
      case "clearStack":
        clearStack();
        break;
      case "pushTaskToBacklog":
        if (res.functionParams) {
          pushTaskToBacklog(
            res.functionParams.task,
            res.functionParams.priority
          );
        }
        break;
      case "popTaskFromBacklog":
        popTaskFromBacklog();
        break;
      case "clearBacklog":
        clearBacklog();
    }

    showSuccessNotification({
      id: "get-openai-res",
      message: res.assistantResponse,
    });
  };

  // Main logic
  useEffect(() => {
    if (transcript === "") return;

    showNotification({
      id: "get-openai-res",
      title: "Handling instruction",
      message: "Give me a second to think! What to do..? 🤔",
    });
    const prompt = populatePrompt(transcript);
    getOpenaiResponse(prompt).then((res: AssistantResponse) => {
      if (!res.functionToCall) {
        showFailureNotification({
          id: "get-openai-res",
          message: res.assistantResponse,
        });
      } else {
        handleAssistantCalls(res);
      }
    });

    setTranscriptVisible(true);
    const fadeOut = setTimeout(() => {
      setTranscriptVisible(false);
      setTranscript("");
    }, 3000);

    return () => {
      clearTimeout(fadeOut);
    };
  }, [transcript]);

  // Local Database
  useEffect(() => {
    console.log(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    console.log(backlog);
    localStorage.setItem("backlog", JSON.stringify(backlog));
  }, [backlog]);

  return (
    <Stack h={"100%"} align="center" justify="center">
      {(tasks.length > 0 || backlog.length > 0) && (
        <Box>
          <Text size={"md"} fw={900} color="dimmed" transform="uppercase">
            Top of stack
          </Text>
        </Box>
      )}

      {tasks.length > 0 ? (
        tasks.map((task, i) => <TaskItem task={task} key={i} />)
      ) : (
        <Box>
          <Image
            maw={250}
            mb={30}
            mx="auto"
            radius="md"
            src="/relax.jpg"
            alt="Random image"
          />
          <Alert title="No tasks left">
            Empty tasks and backlog. Add some!
          </Alert>
        </Box>
      )}
      <Stack sx={{ position: "absolute", bottom: "10%" }}>
        <Text
          px={20}
          color="dimmed"
          sx={{
            textAlign: "center",
            opacity: transcriptVisible ? 1 : 0,
            transition: "opacity 500ms",
          }}
        >
          {transcript}
        </Text>
        <Center>
          <Button
            leftIcon={<IconMicrophone />}
            size="lg"
            maw="fit-content"
            onClick={recognizeSpeech}
            disabled={recording}
            variant="light"
            color="cyan"
          >
            Record Command
          </Button>
        </Center>
      </Stack>
    </Stack>
  );
};

export default TaskStack;
