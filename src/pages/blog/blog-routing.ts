import { basename, extname } from 'node:path';

import type { MarkdownInstance } from 'astro';

const withDatePattern = /^(\d{4})-(\d{2})-(\d{2})-(.*)$/;

function destructureName(filename: string): {
  name: string;
  prefix?: {
    year: string;
    month: string;
    day: string;
    full: string;
    date: Date;
  };
} {
  const found = withDatePattern.exec(filename);
  if (found === null) return { name: filename };

  const [, year, month, day, name] = found;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const full = date.toISOString();
  return full === 'Invalid Date'
    ? { name: filename }
    : {
        name,
        prefix: { year, month, day, full, date },
      };
}

export interface Frontmatter {
  title: string;
  description: string;
  pubDate: string;
  heroImage: string;
}

export type Post = MarkdownInstance<Frontmatter>;

function toStaticPath(post: Post) {
  const filename = basename(post.file, extname(post.file));
  const { name, prefix } = destructureName(filename);
  const [slug, pubFull, pubDate] =
    prefix === undefined
      ? [filename, post.frontmatter.pubDate, new Date(post.frontmatter.pubDate)]
      : [`${prefix.year}/${prefix.month}/${name}`, prefix.full, prefix.date];

  const info = {
    title: post.frontmatter.title,
    url: `/blog/${slug}`,
    pubFull,
    pubDate,
  };

  return {
    params: { slug },
    props: {
      post,
      info
    },
  };
}

export type PostPath = ReturnType<typeof toStaticPath>;

const toInfo = ({ props: { info } }: PostPath) => info;

type Info = ReturnType<typeof toInfo>;

function byPubDateDesc(a: Info, b: Info): number {
  return b.pubDate.valueOf() - a.pubDate.valueOf();
}

async function toPostInfo(postPaths: Promise<PostPath[]>) {
  const paths = await postPaths;
  return paths.map(toInfo).sort(byPubDateDesc);
}

export { toStaticPath, toPostInfo };
