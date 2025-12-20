export type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  image: string;
  attendees: string;
  featured: boolean;
}

export type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: "Art" | "Film" | "Music";
  featured: boolean;
  tags: string[];
  stats: { [key: string]: string | number };
}

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  instagram?: string;
  description: string;
  image: string;
}
