import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { language, source, stdin } = await req.json();

    if (!language || !source) {
      return NextResponse.json(
        { error: "Language and source code are required" },
        { status: 400 }
      );
    }

    // Map template names to OneCompiler language identifiers
    const languageMap: Record<string, string> = {
      PYTHON: "python",
      JAVA: "java",
      C: "c",
      CPP: "cpp",
      JAVASCRIPT: "nodejs",
      GO: "go",
      RUST: "rust",
    };

    const compilerLang = languageMap[language.toUpperCase()];

    if (!compilerLang) {
      return NextResponse.json(
        { error: `Language ${language} is not supported for execution` },
        { status: 400 }
      );
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    
    if (!apiKey) {
      console.error("RAPIDAPI_KEY is not defined in environment variables");
      return NextResponse.json(
        { error: "Server configuration error: Execution API key is missing" },
        { status: 500 }
      );
    }

    // Call the OneCompiler API via RapidAPI
    const response = await fetch("https://onecompiler-apis.p.rapidapi.com/api/v1/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
      },
      body: JSON.stringify({
        language: compilerLang,
        stdin: stdin || "",
        files: [
          {
            name: `index.${compilerLang}`,
            content: source,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Execution service error: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    // Format the OneCompiler response to match Piston's output
    // The frontend extracts result.run.stdout and result.run.stderr and result.run.code
    const formattedResult = {
      run: {
        stdout: result.stdout || "",
        stderr: result.stderr || result.exception || "",
        code: (result.status === "success" && !result.exception) ? 0 : 1,
      }
    };

    return NextResponse.json(formattedResult);
  } catch (error) {
    console.error("Execution error:", error);
    return NextResponse.json(
      { error: "Internal server error during execution" },
      { status: 500 }
    );
  }
}
