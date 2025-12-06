const API_BASE = "/api";

export interface UploadResponse {
  file_id: string;
  filename: string;
  status: string;
}

export interface SummarizeRequest {
  id: string;
  prompt?: string;
  caption_summarization_prompt?: string;
  summary_aggregation_prompt?: string;
  model?: string;
}

export interface SummarizeResponse {
  summary: string;
  file_id: string;
  status: string;
}

export async function uploadVideo(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("purpose", "vision");
  formData.append("media_type", "video");

  const response = await fetch(`${API_BASE}/files`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  const data = await response.json();

  // Map VSS API response (uses "id") to our expected format (uses "file_id")
  return {
    file_id: data.id,
    filename: data.filename,
    status: data.status || "uploaded",
  };
}

export async function summarizeVideo(
  fileId: string,
  prompts: {
    prompt?: string;
    captionSummarizationPrompt?: string;
    summaryAggregationPrompt?: string;
  },
): Promise<SummarizeResponse> {
  const body: SummarizeRequest = {
    id: fileId,
    model: "cosmos-reason1",
  };

  if (prompts.prompt) {
    body.prompt = prompts.prompt;
  }
  if (prompts.captionSummarizationPrompt) {
    body.caption_summarization_prompt = prompts.captionSummarizationPrompt;
  }
  if (prompts.summaryAggregationPrompt) {
    body.summary_aggregation_prompt = prompts.summaryAggregationPrompt;
  }

  const response = await fetch(`${API_BASE}/summarize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Summarization failed: ${error}`);
  }

  const data = await response.json();
  
  // Extract summary from OpenAI-style chat completions response
  const summary = data.choices?.[0]?.message?.content || "";
  
  return {
    summary,
    file_id: fileId,
    status: "completed",
  };
}
