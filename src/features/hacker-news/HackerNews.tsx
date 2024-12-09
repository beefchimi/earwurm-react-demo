import {useEffect, useState} from 'react';

import {TextLink} from '@src/components/ui/TextLink/TextLink.tsx';
import {
  fetchHackerNewsTopStories,
  parseHackerNewsPostIds,
  type HackerNewsStory,
  type HackerNewsTopStories,
} from '@src/features/hacker-news/get-top-stories.ts';

import styles from './HackerNews.module.css';

export function HackerNews() {
  const [storyIds, setStoryIds] = useState<HackerNewsTopStories>([]);
  const [stories, setStories] = useState<HackerNewsStory[]>([]);

  useEffect(() => {
    fetchHackerNewsTopStories()
      .then((result) => {
        setStoryIds(result);
      })
      .catch(() => {
        setStoryIds([]);
      });
  }, []);

  useEffect(() => {
    if (storyIds.length) {
      parseHackerNewsPostIds(storyIds)
        .then((result) => {
          setStories(result);
        })
        .catch(() => {
          setStories([]);
        });
    } else {
      setStories([]);
    }
  }, [storyIds]);

  const itemsMarkup = stories.length ? (
    stories.map((story) => (
      <li key={story.id} className={styles.Item}>
        <TextLink url={story.url} external>
          {story.title}
        </TextLink>

        <p className={styles.Byline}>
          <span className={styles.Score}>{story.score}</span> by{' '}
          <span className={styles.Author}>{story.by}</span>
        </p>
      </li>
    ))
  ) : (
    <li className={styles.Item}>
      <p className={styles.Byline}>
        We were not able to retrieve any Hacker News stories.
      </p>
    </li>
  );

  return (
    <div className={styles.HackerNews}>
      <ul className={styles.List}>{itemsMarkup}</ul>
    </div>
  );
}
