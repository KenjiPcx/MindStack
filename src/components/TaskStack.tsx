import { Alert, Box, Button, Center, Image, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { AppTask } from "../types";
import {
  SpeechConfig,
  SpeechRecognizer,
  AudioConfig,
} from "microsoft-cognitiveservices-speech-sdk";
import { IconCheck, IconMicrophone } from "@tabler/icons-react";
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

const TaskStack = () => {
  const [tasks, setTasks] = useState<AppTask[]>([]);
  const [backlog, setBacklog] = useState<AppTask[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  const [transcriptVisible, setTranscriptVisible] = useState<boolean>(false);
  const [recording, setRecording] = useState<boolean>(false);

  const recognizeSpeech = () => {
    setRecording(true);
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);
    speechRecognizer.recognizeOnceAsync(
      (res) => {
        setTranscript(res.text);
        setRecording(false);
      },
      (err) => {
        console.error(err);
      }
    );
  };

  const pushTaskToStack = (task: string, priority: number = 0) => {
    setTasks(
      [{ task, priority }, ...tasks].sort((a, b) => b.priority - a.priority)
    );
  };

  const popTaskFromStack = () => {
    if (tasks.length == 0) return;
    setTasks((oldTasks) => oldTasks.slice(1));
  };

  const pushTaskToBacklog = (task: string, priority: number = 0) => {
    setBacklog(
      [{ task, priority }, ...backlog].sort((a, b) => b.priority - a.priority)
    );
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

  const showNotification = () => {
    notifications.show({
      id: "get-openai-res",
      loading: true,
      title: "Handling instruction",
      message: "Give me a second to think! What to do..? 🤔",
      autoClose: false,
      withCloseButton: false,
      styles: () => ({
        root: { marginTop: 60 },
      }),
    });
  };

  const showFailureNotification = (assistantResponse: string) => {
    notifications.update({
      id: "get-openai-res",
      color: "red",
      title: "I don't understand",
      message: assistantResponse,
      icon: <IconCheck size="1rem" />,
      autoClose: 5000,
      styles: () => ({
        root: { marginTop: 60 },
      }),
    });
  };

  const handleAssistantCalls = (res: AssistantResponse) => {
    console.log(res);
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

    notifications.update({
      id: "get-openai-res",
      color: "teal",
      title: "All done",
      message: res.assistantResponse,
      icon: <IconCheck size="1rem" />,
      autoClose: 5000,
      styles: () => ({
        root: { marginTop: 60 },
      }),
    });
  };

  useEffect(() => {
    setTasks((oldTasks) => {
      oldTasks.sort((a, b) => b.priority - a.priority);
      return oldTasks;
    });
  }, []);

  useEffect(() => {
    if (transcript === "") return;

    showNotification();
    const prompt = populatePrompt(transcript);
    getOpenaiResponse(prompt).then((res: AssistantResponse) => {
      if (!res.functionToCall) {
        showFailureNotification(res.assistantResponse);
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

  useEffect(() => {
    console.log(tasks);
  }, [tasks]);

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
        tasks
          .slice(0, 6)
          .map((task, i) => <TaskItem task={task} key={i} type={"Stack"} />)
      ) : backlog.length > 0 ? (
        backlog
          .slice(0, 6)
          .map((backlog, i) => (
            <TaskItem task={backlog} key={i} type={"Backlog"} />
          ))
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
