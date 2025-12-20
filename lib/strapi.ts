import { Event, Project } from "@/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Strapi v5 returns data directly without 'attributes' wrapper
interface StrapiItem {
  id: number;
  documentId: string;
  [key: string]: any;
}

// Helper to get image URL
export function getStrapiMedia(url: string | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

// Generic fetch function
async function fetchAPI<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // For dynamic data, use 'force-cache' for static
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const url = `${STRAPI_URL}/api${path}`;

  console.log('Fetching from URL:', url);

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Strapi API error: ${response.status}`, errorText);
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Strapi response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    throw error;
  }
}

// Get all events
export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiItem[]>>(
      '/events?populate=*&sort=date:asc'
    );

    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((item): Event | null => {
      if (!item) return null;

      // Handle image array from Strapi
      const imageUrl = Array.isArray(item.image) && item.image.length > 0
        ? item.image[0].url
        : item.image?.url || null;

      // Map Strapi response to Event type
      return {
        id: item.id,
        title: item.title || '',
        date: item.date || '',
        time: item.time || '',
        location: item.location || '',
        category: item.category || '',
        description: item.description || '',
        image: imageUrl ? getStrapiMedia(imageUrl) : '',
        attendees: item.attendees || '',
        featured: item.featured || false,
      };
    }).filter((event): event is Event => event !== null);

  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Get single event
export async function getEvent(id: number) {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiItem>>(
      `/events/${id}?populate=*`
    );

    if (!response.data) {
      return null;
    }

    return {
      ...response.data,
      image: getStrapiMedia(response.data.image?.url),
    };
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    return null;
  }
}


// Get all events
export async function getTeamMembers() {
  try {
    const res = await fetchAPI<StrapiResponse<StrapiItem[]>>('/team-members?populate=*');

    const items = res?.data ?? [];

    return items.map((item: any) => {
      const img = item.image?.[0]; // first image in the array

      return {
        id: item.id,
        name: item.name,
        role: item.role,
        instagram: item.instagram,
        description: item.description,
        image: img
          ? getStrapiMedia(
            img.formats?.medium?.url ||
            img.formats?.small?.url ||
            img.formats?.thumbnail?.url ||
            img.url
          )
          : null,
      };
    });
  } catch (err) {
    console.error('Error fetching team members:', err);
    return [];
  }
}



// Get all projects
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiItem[]>>(
      '/projects?populate=*&sort=createdAt:asc'
    );

    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((item): Project | null => {
      if (!item) return null;

      // Handle image array from Strapi (similar to events)
      const imageUrl = Array.isArray(item.image) && item.image.length > 0
        ? item.image[0].url
        : item.image?.url || null;

      // Map tags from component structure
      const tags = Array.isArray(item.tags)
        ? item.tags.map((tag: any) => tag.name || tag).filter(Boolean)
        : [];

      // Handle stats JSON field
      const stats = item.stats && typeof item.stats === 'object'
        ? item.stats
        : {};

      // Map Strapi response to Project type
      return {
        id: item.id,
        title: item.title || '',
        description: item.description || '',
        image: imageUrl ? getStrapiMedia(imageUrl) : '',
        category: (item.category === 'Art' || item.category === 'Film' || item.category === 'Music')
          ? item.category
          : 'Art', // Default to 'Art' if category doesn't match
        featured: item.featured || false,
        tags: tags,
        stats: stats,
      };
    }).filter((project): project is Project => project !== null);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Get single project
export async function getProject(id: number) {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiItem>>(
      `/projects/${id}?populate=*`
    );

    if (!response.data) {
      return null;
    }

    return {
      ...response.data,
      image: getStrapiMedia(response.data.image?.url),
      tags: response.data.tags?.map((tag: any) => tag.name) || [],
    };
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
}

// Get all home cards
export async function getHomeCards() {
  try {
    console.log('Calling getHomeCards...');
    const response = await fetchAPI<StrapiResponse<StrapiItem[]>>(
      '/home-cards?populate=*&sort=cardId:asc'
    );

    console.log('Raw Strapi response:', JSON.stringify(response, null, 2));

    if (!response.data) {
      console.warn('No data in response');
      return [];
    }

    if (!Array.isArray(response.data)) {
      console.warn('Response data is not an array:', response.data);
      return [];
    }

    console.log('Number of items:', response.data.length);

    const mapped = response.data.map((item, index) => {
      console.log(`Processing item ${index}:`, item);

      if (!item) {
        console.warn(`Item ${index} is null or undefined`);
        return null;
      }

      // Strapi v5: image is directly on the item, not nested in attributes
      const imageUrl = item.image?.url;
      console.log(`Item ${index} image URL:`, imageUrl);

      const result = {
        ...item,
        image: getStrapiMedia(imageUrl),
      };

      console.log(`Item ${index} mapped result:`, result);
      return result;
    });

    console.log('Mapped cards BEFORE filter:', mapped);
    const filtered = mapped.filter(Boolean);
    console.log('Mapped cards AFTER filter:', filtered);

    return filtered;
  } catch (error) {
    console.error('Error fetching home cards:', error);
    return [];
  }
}

// Get featured events
export async function getFeaturedEvents() {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiItem[]>>(
      '/events?populate=*&filters[featured][$eq]=true&sort=date:asc'
    );

    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((item) => {
      if (!item) return null;

      return {
        ...item,
        image: getStrapiMedia(item.image?.url),
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Error fetching featured events:', error);
    return [];
  }
}

// Get featured projects
export async function getFeaturedProjects() {
  try {
    const response = await fetchAPI<StrapiResponse<StrapiItem[]>>(
      '/projects?populate=*&filters[featured][$eq]=true&sort=createdAt:desc'
    );

    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((item) => {
      if (!item) return null;

      return {
        ...item,
        image: getStrapiMedia(item.image?.url),
        tags: item.tags?.map((tag: any) => tag.name) || [],
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}