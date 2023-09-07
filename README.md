# MindStack

A visual representation of your context stack

## Problem

Have you ever been overloaded with tasks and struggled to keep track of them? Do you find yourself easily distracted and wasting time on unrelated activities? If so, the MindStack app is here to help.

## Solution

The MindStack app is a short term memory context visualizer that allows you to easily keep track of your tasks and prioritize them. With simple voice commands, you can add tasks to the stack, remove them, and clear the stack. The app is based on a simple stack data structure and is accessible through voice commands, making it easy and efficient to use.

There is a stack and a backlog, stack currently displays the top 7 tasks, when more are added, lower priority ones are pushed onto the backlog. When a task is popped from the stack, if backlog is empty, the highest prioritized one will be added back to the bottom of the stack.

## Impact
With the MindStack app, you no longer have to worry about forgetting tasks or wasting time on unrelated activities. You can prioritize tasks and determine whether to work on them now or later, increasing your productivity and efficiency. The potential impact of this app is super high, with an estimated +100% efficiency.

## Implementation

### Tech Stack
The MindStack app is built using 
- React Vite and Mantine UI for the frontend
- Azure STT for speech recognition
- OpenAI for LLM features
- There is no backend, we simply persist state through local storage
- App is deployed on Vercel

## How to use

To use the app, simply open it and use voice commands to add tasks, remove them, or clear the stack. The app is designed to be simple and easy to use, with a mobile view and a larger view for desktops.

### Installation and Usage

- Clone the repository
- Install dependencies with `pnpm install`
- Start the app with `pnpm start`
- Use voice commands to add tasks, remove them, or clear the stack, instructions should be on the navbar of the app
