const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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
    documentType?: string;
    patientInfo?: {
      name?: string;
      age?: string | number;
      gender?: string;
      id?: string;
    };
    medicalConditions?: string[];
    medications?: {
      name?: string;
      dosage?: string;
      frequency?: string;
    }[];
    testResults?: {
      testName?: string;
      value?: string | number;
      unit?: string;
      referenceRange?: string;
    }[];
    dates?: Array<string | { date?: string; context?: string }>;
    emails?: string[];
    phones?: string[];
    medicalTerms?: Array<string | { term?: string; explanation?: string }>;
    numbers?: Array<string | number>;
    summary?: string;
    criticalFindings?: string[];
    confidence?: string;
    [key: string]: any;
  };
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
  metadata: {
    pageCount?: number;
    language?: string;
    detectedEntities?: string[];
    pdfMetadata?: any;
    processingDate?: string;
    aiModel?: string;
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
