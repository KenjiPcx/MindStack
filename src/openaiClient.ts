import OpenAI from "openai";

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
    - pushTaskToBacklog(task: string, priority: number)
    -- exactly the same with "pushTaskToStack" but for a backlog
    - popTaskFromBacklog()
    -- exactly the same with "popTaskFromStack" but for a backlog
    - clearBacklog()
    -- exactly the same with "clearStack" but for a backlog

    [Output]
    Return me a stringified json object where we have 
    - a field called "functionToCall" which tells us which function to call
    - an optional field called "functionParams" that only exists for the "pushTaskToStack" function
    - a field called "assistantResponse" which is a short generated assistant response based on my transcript

    Response structure with typescript notation:
    {
            "functionToCall": "pushTaskToStack" | "popTaskFromStack" | "clearStack";
            "functionParams"?: { "task": string; "priority": number };
            "assistantResponse": string;
    } 

    [Extra Rules]
    - Only one function can be called in each response
    - If no function is detected, then just set "functionToCall" to be null
    - If the priority mentioned in the transcript exceeds the limits, bound it within 0 to 10
    - Assistant response could be supportive, funny, reference memes or culture, judgemental, motivational or just "done", I want my productivity app to have a personality like Andrew Tate and Elon Musk

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
