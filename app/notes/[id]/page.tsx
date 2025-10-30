import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import getQueryClient from "@/lib/getQueryClient";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from 'next';

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const note = await fetchNoteById(id);
    
    return {
      title: `${note.title} - NoteHub`,
      description: note.content.substring(0, 160) + (note.content.length > 160 ? '...' : ''),
      openGraph: {
        title: `${note.title} - NoteHub`,
        description: note.content.substring(, 160) + (note.content.length > 160 ? '...' : ''),
        url: `https://your-app-url.vercel.app/notes/${id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Note Not Found - NoteHub',
      description: 'The requested note could not be found.',
    };
  }
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}