const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Document {
  _id: string;
  userId: string;
  userEmail: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  ocrText: string;
  ocrConfidence: number;
  extractedData: {
    dates: string[];
    emails: string[];
    phones: string[];
    medicalTerms: string[];
    numbers: string[];
  };
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
  metadata: {
    pageCount?: number;
    language?: string;
    detectedEntities?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface DocumentsResponse {
  documents: Document[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Fetch all documents for the authenticated user
 */
export async function getDocuments(
  token: string,
  params?: {
    status?: string;
    limit?: number;
    page?: number;
  }
): Promise<ApiResponse<DocumentsResponse>> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.page) queryParams.append('page', params.page.toString());

  const url = `${API_URL}/api/documents${queryParams.toString() ? `?${queryParams}` : ''}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

/**
 * Fetch a specific document by ID
 */
export async function getDocument(
  token: string,
  documentId: string
): Promise<ApiResponse<Document>> {
  const response = await fetch(`${API_URL}/api/documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

/**
 * Delete a document
 */
export async function deleteDocument(
  token: string,
  documentId: string
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_URL}/api/documents/${documentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
