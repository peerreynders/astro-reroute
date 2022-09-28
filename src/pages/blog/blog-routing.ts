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
  const url = `/blog/${slug}`;
  const title = post.frontmatter.title;

  return {
    params: { slug },
    props: {
      post,
      title,
      pubFull,
      pubDate,
      url,
    },
  };
}

export type PostPath = ReturnType<typeof toStaticPath>;

export { toStaticPath };

