import { readTemplateStructureFromJson, saveTemplateStructureToJson, scanTemplateDirectory } from "@/features/playground/libs/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import fs from "fs/promises";
import { NextRequest } from "next/server";

const PYTHON_TEMPLATE_FALLBACK = [
  {
    "filename": "main",
    "fileExtension": "py",
    "content": "def main():\n    print(\"Hello from Python!\")\n\nif __name__ == \"__main__\":\n    main()\n"
  }
];

const JAVA_TEMPLATE_FALLBACK = [
  {
    "filename": "Main",
    "fileExtension": "java",
    "content": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello from Java!\");\n    }\n}\n"
  }
];

const C_TEMPLATE_FALLBACK = [
  {
    "filename": "main",
    "fileExtension": "c",
    "content": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello from C!\\n\");\n    return 0;\n}\n"
  }
];

const CPP_TEMPLATE_FALLBACK = [
  {
    "filename": "main",
    "fileExtension": "cpp",
    "content": "#include <iostream>\n\nint main() {\n    std::cout << \"Hello from C++!\" << std::endl;\n    return 0;\n}\n"
  }
];

const JS_TEMPLATE_FALLBACK = [
  {
    "filename": "index",
    "fileExtension": "js",
    "content": "console.log(\"Hello from JavaScript!\");\n"
  }
];

const GO_TEMPLATE_FALLBACK = [
  {
    "filename": "main",
    "fileExtension": "go",
    "content": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello from Go!\")\n}\n"
  }
];

const RUST_TEMPLATE_FALLBACK = [
  {
    "filename": "main",
    "fileExtension": "rs",
    "content": "fn main() {\n    println!(\"Hello from Rust!\");\n}\n"
  }
];

// Helper function to ensure valid JSON
function validateJsonStructure(data: unknown): boolean {
  try {
    JSON.parse(JSON.stringify(data)); // Ensures it's serializable
    return true;
  } catch (error) {
    console.error("Invalid JSON structure:", error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("Template API: Fetching for ID:", id);

  if (!id) {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  const playground = await db.playground.findUnique({
    where: { id },
    include: {
      templateFiles: true,
    },
  });

  if (!playground) {
    console.warn("Template API: Playground not found for ID:", id);
    return Response.json({ error: `Playground with ID ${id} not found in database` }, { status: 404 });
  }

  console.log("Template API: Found playground:", playground.id, "Template:", playground.template);

  const templateKey = playground.template as keyof typeof templatePaths;
  const templatePath = templatePaths[templateKey];

  if (!templatePath) {
    console.error("Template API: Invalid template key in database:", templateKey);
    return Response.json({ error: `Template type '${templateKey}' not found in templatePaths mapping` }, { status: 404 });
  }

  try {
    const inputPath = path.join(process.cwd(), templatePath);

    // Check if directory exists
    try {
      const stats = await fs.stat(inputPath);
      if (!stats.isDirectory()) {
         return Response.json({ error: `Template path ${templateKey} is not a directory` }, { status: 500 });
      }
    } catch (err) {
      console.warn(`Template API: Template directory for ${templateKey} not found at ${inputPath}. Checking for fallbacks.`);
      
      // Fallback if directory is missing
      const fallbacks: Record<string, any[]> = {
        PYTHON: PYTHON_TEMPLATE_FALLBACK,
        JAVA: JAVA_TEMPLATE_FALLBACK,
        C: C_TEMPLATE_FALLBACK,
        CPP: CPP_TEMPLATE_FALLBACK,
        JAVASCRIPT: JS_TEMPLATE_FALLBACK,
        GO: GO_TEMPLATE_FALLBACK,
        RUST: RUST_TEMPLATE_FALLBACK,
        // Legacy fallbacks
        REACT: JS_TEMPLATE_FALLBACK,
        NEXTJS: JS_TEMPLATE_FALLBACK,
        EXPRESS: JS_TEMPLATE_FALLBACK,
        VUE: JS_TEMPLATE_FALLBACK,
        HONO: JS_TEMPLATE_FALLBACK,
        ANGULAR: JS_TEMPLATE_FALLBACK,
      };

      if (fallbacks[templateKey]) {
        console.log(`Template API: Using hardcoded fallback for ${templateKey} template`);
        return Response.json({ 
          success: true, 
          templateJson: {
            folderName: templateKey.toLowerCase(),
            items: fallbacks[templateKey]
          } 
        }, { status: 200 });
      }

      console.error("Template API: Error accessing template directory and no fallback found:", err);
      return Response.json({ error: `Template directory for ${templateKey} not found at ${inputPath} and no fallback available` }, { status: 404 });
    }

    // Scan the template directory directly
    try {
      const result = await scanTemplateDirectory(inputPath);
      console.log("Template API: Successfully scanned directory:", inputPath);

      // Validate the JSON structure before saving
      if (!validateJsonStructure(result.items)) {
        return Response.json({ error: "Invalid JSON structure" }, { status: 500 });
      }

      return Response.json({ success: true, templateJson: result }, { status: 200 });
    } catch (scanError) {
      console.error(`Template API: Directory scan failed for ${templateKey}:`, (scanError as Error).message);
      throw scanError;
    }
  } catch (error) {
    console.error("Error generating template JSON:", error);
    return Response.json({ error: `Failed to generate template: ${(error as Error).message}` }, { status: 500 });
  }
}


