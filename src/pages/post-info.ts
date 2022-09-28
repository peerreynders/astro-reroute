import type { PostPath } from './blog/blog-routing';

function toInfo({ props }: PostPath) {
  const { title, url, pubFull, pubDate } = props;
  return { title, url, pubFull, pubDate };
}

type Info = ReturnType<typeof toInfo>;

function byPubDate(a: Info, b: Info): number {
  return b.pubDate.valueOf() - a.pubDate.valueOf();
}

async function toPostInfo(postPaths: Promise<PostPath[]>) {
  const paths = await postPaths;
  return paths.map(toInfo).sort(byPubDate);
}

export { toPostInfo };

