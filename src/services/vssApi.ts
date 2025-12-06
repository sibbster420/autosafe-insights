const API_BASE = '/api';

export interface UploadResponse {
  file_id: string;
  filename: string;
  status: string;
}

export interface SummarizeRequest {
  file_id: string;
  prompt?: string;
  caption_summarization_prompt?: string;
  summary_aggregation_prompt?: string;
}

export interface SummarizeResponse {
  summary: string;
  file_id: string;
  status: string;
}

export async function uploadVideo(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('purpose', 'vision');
  formData.append('media_type', 'video');

  const response = await fetch(`${API_BASE}/files`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  return response.json();
}

export async function summarizeVideo(
  fileId: string,
  prompts: {
    prompt?: string;
    captionSummarizationPrompt?: string;
    summaryAggregationPrompt?: string;
  }
): Promise<SummarizeResponse> {
  const body: SummarizeRequest = {
    file_id: fileId,
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Summarization failed: ${error}`);
  }

  return response.json();
}
