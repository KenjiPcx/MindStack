import {
  Alert,
  Box,
  Button,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { AppTask } from "../types";
import {
  SpeechConfig,
  SpeechRecognizer,
  AudioConfig,
} from "microsoft-cognitiveservices-speech-sdk";
import { IconMicrophone } from "@tabler/icons-react";

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

const speechConfig = SpeechConfig.fromSubscription(
  import.meta.env.VITE_AZURE_SPEECH_RECOGNITION_KEY,
  import.meta.env.VITE_AZURE_REGION
);
speechConfig.speechRecognitionLanguage = "en-US";

const TaskStack = () => {
  const [tasks, setTasks] = useState<AppTask[]>(mockTasks);
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

  useEffect(() => {
    if (transcript === "") return;

    const fadeIn = setTimeout(() => {
      setTranscriptVisible(true);
    }, 100);
    const fadeOut = setTimeout(() => {
      setTranscriptVisible(false);
    }, 3000);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
    };
  }, [transcript]);

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
      <Stack sx={{ position: "absolute", bottom: "10%" }}>
        <Text
          color="dimmed"
          sx={{
            textAlign: "center",
            opacity: transcriptVisible ? 1 : 0,
            transition: "opacity 500ms",
          }}
        >
          {transcript}
        </Text>
        <Button
          leftIcon={<IconMicrophone />}
          size="lg"
          onClick={recognizeSpeech}
          disabled={recording}
          variant="light"
        >
          Record Command
        </Button>
      </Stack>
    </Stack>
  );
};

export default TaskStack;
