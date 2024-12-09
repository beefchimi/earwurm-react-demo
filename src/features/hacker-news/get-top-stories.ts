import {clamp, getErrorMessage} from 'beeftools';
import {
  typedArray,
  typedNumber,
  typedObject,
  typedString,
  type TypeGuard,
} from '@src/utilities/json.ts';

const hackerNewsStoryTypes = [
  'job',
  'story',
  'comment',
  'poll',
  'pollopt',
] as const;

type HackerNewsStoryType = (typeof hackerNewsStoryTypes)[number];

export interface HackerNewsStory {
  id: number;
  type: HackerNewsStoryType;
  url: string;
  title: string;
  by: string;
  score: number;
  time?: number;
  descendants?: number;
  kids?: number[];
}

export type HackerNewsTopStories = number[];

const ENDPOINT_TOP_STORIES =
  'https://hacker-news.firebaseio.com/v0/topstories.json';

function storyEndpoint(id = '1') {
  return `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
}

const typedStoryType: TypeGuard<HackerNewsStoryType> = (value: unknown) => {
  if (
    typeof value !== 'string' &&
    !hackerNewsStoryTypes.includes(value as HackerNewsStoryType)
  ) {
    throw new Error();
  }

  return value as HackerNewsStoryType;
};

export async function fetchHackerNewsTopStories(
  limit = 10,
): Promise<HackerNewsTopStories> {
  const safeLimit = clamp(1, limit, 500);
  const parsedResponse = typedArray(typedNumber);

  try {
    const response = await fetch(
      `${ENDPOINT_TOP_STORIES}?limitToFirst=${safeLimit}&orderBy="$key"`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = parsedResponse(await response.json());

    return result;
  } catch (error) {
    console.error('Error fetching data:', getErrorMessage(error));
    throw error;
  }
}

export async function parseHackerNewsPostIds(
  postIds: HackerNewsTopStories = [],
): Promise<HackerNewsStory[]> {
  const parsedResponse = typedObject({
    id: typedNumber,
    type: typedStoryType,
    url: typedString,
    title: typedString,
    by: typedString,
    score: typedNumber,

    // TODO: Figure out how to type-guard with "optional" props.
    // time: typedNumber,
    // descendants: typedNumber,
    // kids: typedArray(typedNumber),
  });

  return await Promise.all(
    postIds.map(async (id) => {
      try {
        const response = await fetch(storyEndpoint(`${id}`));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = parsedResponse(await response.json());

        return result;
      } catch (error) {
        // Consider returning an empty object instead of throwing.
        // return {} as HackerNewsStory;
        console.error('Error fetching data:', getErrorMessage(error));
        throw error;
      }
    }),
  );
}
