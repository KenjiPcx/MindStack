import { Alert, Box, Button, Image, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { AppTask } from "../types";
import {
  SpeechConfig,
  SpeechRecognizer,
  AudioConfig,
} from "microsoft-cognitiveservices-speech-sdk";
import { IconMicrophone } from "@tabler/icons-react";
import TaskItem from "./TaskItem";
import { getOpenaiResponse, populatePrompt } from "../openaiClient";

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
    setTasks((oldTasks) => {
      oldTasks.sort((a, b) => b.priority - a.priority);
      return oldTasks;
    });
  }, []);

  useEffect(() => {
    if (transcript === "") return;

    console.log("Calling with transcript", transcript);
    const prompt = populatePrompt(transcript);
    getOpenaiResponse(prompt).then((res) => {
      console.log(res);
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
          color="cyan"
        >
          Record Command
        </Button>
      </Stack>
    </Stack>
  );
};

export default TaskStack;
