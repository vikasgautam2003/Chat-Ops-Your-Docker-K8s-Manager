





// import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.GOOGLE_API_KEY || "";
// if (!apiKey) {
//   throw new Error("Missing GOOGLE_API_KEY");
// }

// const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// export async function POST(req) {
//   try {
//     const { history, message, tools } = await req.json();

//     const chat = model.startChat({
//       history: history || [],
//       tools: tools && tools.length > 0
//         ? [{ functionDeclarations: tools }]
//         : [],
//     });

//     const result = await chat.sendMessage(message);
//     const response = result.response;

//     const functionCalls = response.functionCalls();

//     if (functionCalls && functionCalls.length > 0) {
//       const call = functionCalls[0];

//       return Response.json({
//         role: "model",
//         toolRequest: {
//           name: call.name,
//           args: call.args || {},
//         },
//       });
//     }

//     return Response.json({
//       role: "model",
//       text: response.text(),
//     });
//   } catch (error) {
//     return Response.json(
//       { error: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }





import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req) {
  try {
    const { history, message, tools } = await req.json();

    const chat = model.startChat({
      history: history || [],
      tools: tools && tools.length > 0 ? [{ functionDeclarations: tools }] : [],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      return Response.json({
        role: "model",
        toolRequest: {
          name: call.name,
          args: call.args || {},
        },
      });
    }

    return Response.json({
      role: "model",
      text: response.text(),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
