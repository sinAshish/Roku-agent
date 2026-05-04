# Roku-agent

> **Backstory:** My TV remote died and I was too lazy to buy batteries. 30 minutes of AI prompting later, I was controlling my Roku with this agent instead. 

A custom extension for the [Pi Coding Agent](https://pi.dev/) that turns your AI agent into a smart, programmable network remote for your Roku TV!

With this extension, you can ask your coding agent to control your TV, search for content, navigate menus, adjust the volume, and launch specific apps. You can use any LLM API provider configured with Pi to power this agent.

## Features

- **Smart Remote Control**: Navigate menus, hit play/pause, back, or adjust the volume with simple conversational commands.
- **App Management**: List installed apps and channels, or launch apps like Prime Video and Netflix instantly without navigating the home screen.
- **Search & Launch**: Search for movies, TV shows, or anime by title and optionally launch them immediately in a specific streaming provider.
- **Deep Linking**: Launch directly into specific content inside supported apps using Content IDs.

## Requirements

1. **Pi Coding Agent**: You need to have the [Pi Coding Agent](https://pi.dev/) installed.
2. **LLM API**: Any LLM API configured with Pi (e.g., OpenAI, Anthropic, Gemini, local models) that supports function calling.
3. **Network Access**: Your Roku TV must be on the same local network as the machine running the Pi agent.
4. **Roku Settings**: To use advanced features like Search & Launch or Deep Linking, you must enable open access on your TV:
   - On your TV, navigate to **Settings** > **System** > **Advanced system settings** > **Control by mobile apps** > **Network access**
   - Set it to **Permissive**.

## Installation

1. Copy `roku-extension.ts` into your Pi Agent's extensions directory or project directory.
2. Update the `ROKU_IP` constant at the top of the `roku-extension.ts` file to match the IP address of your Roku TV on your local network.

### Finding your Roku TV's IP Address using Pi

The easiest way to find your TV's IP address is to ask the Pi Agent itself to find it for you! Since Pi has terminal access, you can simply tell it:

> *"Find the IP address of my Roku TV on the local network."*

Pi will typically use commands like `arp -a`, `nmap`, or `arp-scan` to scan your local network for devices identifying themselves as Roku (or MAC addresses associated with Roku). Once Pi gives you the IP address, you can ask Pi to update the `roku-extension.ts` file for you automatically, or you can paste it in yourself:

```typescript
const ROKU_IP = "192.168.1.XX"; // Replace with your TV's IP
```

Alternatively, you can find the IP manually on your TV by going to **Settings > Network > About**.

## How to Use

Start up your Pi agent and just talk to it! Here are some examples of what you can say:

- *"List all the apps installed on my Roku."*
- *"Launch Prime Video."*
- *"Search for the movie 'Your Name' and launch it on Netflix."*
- *"Press the home button, then go down twice, right once, and hit OK."*
- *"Turn the volume down by 3."*
- *"Pause the TV."*

## Available Tools (Under the Hood)

- `roku_press_key`: Presses physical remote keys (Home, Select, Left, Right, Up, Down, Back, VolumeUp, VolumeDown, Play, Rev, Fwd, PowerOff, PowerOn).
- `roku_list_apps`: Returns an XML list of all installed apps and their internal Roku App IDs.
- `roku_launch_app`: Launches a specific app using its App ID.
- `roku_search_and_launch`: Performs a system-wide search for keywords (movies, shows) and can launch the results in a target provider app.
- `roku_deep_link`: Bypasses the home screen to launch an app and jump directly to specific media using a content ID.

## Disclaimer

Because third-party apps (like Netflix or Prime Video) do not broadcast their internal state through Roku's API, the agent cannot query exactly what show is currently playing or directly read inside an app. It operates purely as a network remote and launcher.
