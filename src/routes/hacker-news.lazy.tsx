import {createLazyFileRoute} from '@tanstack/react-router';
import {HackerNews} from '@src/features/hacker-news/HackerNews.tsx';

export const Route = createLazyFileRoute('/hacker-news')({
  component: HackerNewsRoute,
});

export function HackerNewsRoute() {
  return <HackerNews />;
}
