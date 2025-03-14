import type { MapResponse, CreateResourceParams, ApiResponse, Resource } from '@/types/maps';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.stiletto.live';

export async function createMap(
  name: string,
  date: string,
  mapType: string
): Promise<MapResponse> {
  try {
    const response = await fetch(`${API_URL}/maps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        date,
        mapType,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create map');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating map:', error);
    throw error;
  }
}

export async function getMap(mapId: string, pass: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/maps/${mapId}?pass=${pass}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching map:', error);
    throw error;
  }
}

export async function getResources(mapId: string, pass: string): Promise<Response> {
  try {
    return await fetch(`${API_URL}/maps/${mapId}/resources?pass=${pass}`);
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
}

export async function createResource(params: CreateResourceParams): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_URL}/maps/${params.mapid}/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    return response.json();
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
}

export async function deleteResource(
  mapId: string,
  resourceId: string,
  resourceToken: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${API_URL}/maps/${mapId}/resources/${resourceId}?token=${resourceToken}`,
      {
        method: 'DELETE',
      }
    );

    return response.json();
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error;
  }
}

export async function updateResourceTime(
  mapId: string,
  resourceId: string,
  resourceToken: string,
  newTime: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${API_URL}/maps/${mapId}/resources/${resourceId}?token=${resourceToken}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ harvested: newTime }),
      }
    );

    return response.json();
  } catch (error) {
    console.error('Error updating resource time:', error);
    throw error;
  }
} 