import { Type } from "typebox";
import * as http from "node:http";

const ROKU_IP = "192.168.1.XX";
const ROKU_PORT = 8060;

function rokuRequest(path: string, method: string = "POST"): Promise<string> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: ROKU_IP,
      port: ROKU_PORT,
      path: path,
      method: method,
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.end();
  });
}

export default function (pi: any) {
  pi.registerTool({
    name: "roku_press_key",
    label: "Roku Press Key",
    description: "Press a key on the Roku TV remote (e.g. Home, PowerOff, PowerOn, Up, Down, Left, Right, Select, Back, VolumeUp, VolumeDown, VolumeMute)",
    promptGuidelines: [
      "Use roku_press_key to control the Roku TV remote."
    ],
    parameters: Type.Object({
      key: Type.String({ description: "The key to press (Home, PowerOff, PowerOn, Up, Down, Left, Right, Select, Back, Play, Rev, Fwd, VolumeUp, VolumeDown, VolumeMute)" })
    }),
    async execute(_toolCallId: string, params: any, _signal: any, _onUpdate: any, ctx: any) {
      try {
        await rokuRequest(`/keypress/${params.key}`);
        return {
          content: [{ type: "text", text: `Successfully pressed ${params.key} on Roku TV.` }],
          details: { key: params.key }
        };
      } catch (err: any) {
        throw new Error(`Failed to press key on Roku: ${err.message}`);
      }
    }
  });

  pi.registerTool({
    name: "roku_list_apps",
    label: "Roku List Apps",
    description: "List all installed apps/channels on the Roku TV.",
    parameters: Type.Object({}),
    async execute(_toolCallId: string, _params: any, _signal: any, _onUpdate: any, ctx: any) {
      try {
        const xml = await rokuRequest("/query/apps", "GET");
        return {
          content: [{ type: "text", text: xml }],
          details: { xml }
        };
      } catch (err: any) {
        throw new Error(`Failed to list apps on Roku: ${err.message}`);
      }
    }
  });

  pi.registerTool({
    name: "roku_search_and_launch",
    label: "Roku Search and Launch",
    description: "Search for a movie or show and optionally launch it on a specific app (e.g., Netflix, Prime Video). Note: Requires TV's 'Control by mobile apps' network access to be set to 'Permissive'.",
    parameters: Type.Object({
      keyword: Type.String({ description: "The title or keyword to search for" }),
      type: Type.Optional(Type.String({ description: "Type of content (e.g., movie, tv-show, person, channel, game)" })),
      providerId: Type.Optional(Type.String({ description: "App ID to launch the content in (e.g., 12 for Netflix, 13 for Prime Video)" })),
      launch: Type.Optional(Type.Boolean({ description: "Whether to launch the content immediately (true) or just search (false)" }))
    }),
    async execute(_toolCallId: string, params: any, _signal: any, _onUpdate: any, ctx: any) {
      try {
        let path = `/search/browse?keyword=${encodeURIComponent(params.keyword)}`;
        if (params.type) path += `&type=${encodeURIComponent(params.type)}`;
        if (params.providerId) path += `&provider-id=${encodeURIComponent(params.providerId)}`;
        if (params.launch !== undefined) path += `&launch=${params.launch ? 'true' : 'false'}`;
        
        await rokuRequest(path, "POST");
        return {
          content: [{ type: "text", text: `Successfully sent search command to Roku for: ${params.keyword}` }],
          details: { params, path }
        };
      } catch (err: any) {
        throw new Error(`Failed to search on Roku: ${err.message}`);
      }
    }
  });

  pi.registerTool({
    name: "roku_deep_link",
    label: "Roku Deep Link",
    description: "Deep link directly into an app with a specific content ID and media type.",
    parameters: Type.Object({
      appId: Type.String({ description: "The ID of the app to launch (e.g., 12 for Netflix, 13 for Prime)" }),
      contentId: Type.String({ description: "The content ID specific to the app" }),
      mediaType: Type.String({ description: "The media type (e.g., movie, episode, series)" })
    }),
    async execute(_toolCallId: string, params: any, _signal: any, _onUpdate: any, ctx: any) {
      try {
        const path = `/launch/${params.appId}?contentId=${encodeURIComponent(params.contentId)}&mediaType=${encodeURIComponent(params.mediaType)}`;
        await rokuRequest(path, "POST");
        return {
          content: [{ type: "text", text: `Successfully deep linked to content ${params.contentId} on app ${params.appId}.` }],
          details: { params }
        };
      } catch (err: any) {
        throw new Error(`Failed to deep link on Roku: ${err.message}`);
      }
    }
  });
}