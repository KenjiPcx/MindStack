import OpenAI from "openai";
import { AppTask } from "./types";

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_KEY,
  dangerouslyAllowBrowser: true,
});

export const populatePrompt = (transcript: string) => {
  return `
    You are my assistant and your role is to help me detect intents from my transcript and decide which function to call for my task app that organizes tasks onto a priority stack to represent short term memory.

    [Functions]
    - pushTaskToStack(task: string, priority: number)
    -- useful for adding a new task onto the stack, task is just a simple string, and priority is a number from 0 to 10, larger numbers represent higher priority and defaults to 0
    - popTaskFromStack()
    -- useful for removing a task (the topmost one) when it is done or completed
    - clearStack()
    -- useful for clearing the stack
    -- need to mention the word "stack" and not anything else
    - pushTaskToBacklog(task: string, priority: number)
    -- exactly the same with "pushTaskToStack" but for a backlog
    - popTaskFromBacklog()
    -- exactly the same with "popTaskFromStack" but for a backlog
    - clearBacklog()
    -- exactly the same with "clearStack" but for a backlog
    -- need to mention the word "backlog" and not anything else

    [Output]
    Return me a stringified json object where we have 
    - a field called "functionToCall" which tells us which function to call
    - an optional field called "functionParams" that only exists for the "pushTaskToStack" function
    - a field called "assistantResponse" which is a short generated assistant response based on my transcript

    Response structure with typescript notation:
    {
            "functionToCall": "pushTaskToStack" | "popTaskFromStack" | "clearStack" | "pushTaskToBacklog" | "popTaskFromBacklog" | "clearBacklog";
            "functionParams"?: { "task": string; "priority": number };
            "assistantResponse": string;
    } 

    [Extra Rules]
    - Only one function can be called in each response
    - For extracted task, it should be summarized and actionable
    - If no function is detected or the intent isn't clear, then just set "functionToCall" to be null, I want at least 95% intent match accuracy, don't assume if its not clear
    - If the priority mentioned in the transcript exceeds the limits, bound it within 0 to 10
    - Assistant response could be supportive, funny, reference memes or culture, judgemental, motivational or just "done", I want my productivity app to have a personality like Andrew Tate and Elon Musk
    - You may assume priority from certain words
      - "do it now" means a 10
      - "urgent / high priority" would be a 7-9
      - "will do it right after" would be a 4-6
      - "can do it at the end of the day" would be a 1-3

    ------------------------------------------------------------------------------------------------------------

    [Example]
    Transcript:  "I need to add a task to my stack with high priority."
    Intent:
    {
        "functionToCall": "pushTaskToStack",
        "functionParams": {
                "task": "add a task to my stack",
                "priority": 10
                },
        "assistantResponse": "what task? but sure why not?"
    }

    Transcript: "${transcript}"
    Intent:
`;
};

export const getOpenaiResponse = async (prompt: string) => {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo-0613",
  };
  const completion: OpenAI.Chat.ChatCompletion =
    await openai.chat.completions.create(params);

  return JSON.parse(completion.choices[0].message.content!);
};

export type AssistantResponse = {
  functionToCall:
    | "pushTaskToStack"
    | "popTaskFromStack"
    | "clearStack"
    | "pushTaskToBacklog"
    | "popTaskFromBacklog"
    | "clearBacklog"
    | null;
  functionParams?: {
    task: AppTask["task"];
    priority: AppTask["priority"];
  };
  assistantResponse: string;
};
