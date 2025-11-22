import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || "all";

  return {
    title: tag === "all" ? "All Notes - NoteHub" : `${tag} Notes - NoteHub`,
    description:
      tag === "all"
        ? "Browse all your notes in NoteHub"
        : `Browse notes filtered by ${tag} tag in NoteHub`,
    openGraph: {
      title: tag === "all" ? "All Notes - NoteHub" : `${tag} Notes - NoteHub`,
      description:
        tag === "all"
          ? "Browse all your notes in NoteHub"
          : `Browse notes filtered by ${tag} tag in NoteHub`,
      url: `https://your-app-url.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: tag === "all" ? "All Notes" : `${tag} Notes`,
        },
      ],
    },
  };
}

export default async function FilterPage({
  params,
  searchParams,
}: FilterPageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const tag = slug?.[0] || "all";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentPage, "", tag],
    queryFn: () =>
      fetchNotes(currentPage, "", 12, tag === "all" ? undefined : tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
