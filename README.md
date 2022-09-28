# astro-reroute
Example of remapping static routes with dynamic ones:

Changes from original Astro blog template:
- Moved posts from `src/pages/blog/*.{md,mdx}` to [`src/pages/_blog`](src/pages/_blog) ([Excluding Pages](https://docs.astro.build/en/core-concepts/routing/#excluding-pages))
- Added [`src/pages/blog/[...slug].astro`](src/pages/blog/[...slug].astro) ([`src/pages/blog/blog-routing.ts`](src/pages/blog/blog-routing.ts)) to provide the dynamic routing for the `_blog/` posts. ([Rest Parameters](https://docs.astro.build/en/core-concepts/routing/#rest-parameters), [`Astro.glob()`](https://docs.astro.build/en/reference/api-reference/#astroglob), [Importing Markdown](https://docs.astro.build/en/guides/markdown-content/#content), [`MarkdownInstance<T>`](https://docs.astro.build/en/reference/api-reference/#markdown-files))
- Modified [`src/pages/blog.astro`](src/pages/blog.astro) to load information from [`src/pages/blog/[...slug].astro`](src/pages/blog/[...slug].astro). ([`getStaticPaths()`](https://docs.astro.build/en/reference/api-reference/#getstaticpaths))
- Had to add `"types": ["./node_modules/astro/astro-jsx"]` to `tsconfig.lint.json` because the [MDX integration](https://docs.astro.build/en/guides/integrations-guide/mdx/#quick-install) was referencing the `JSX` namespace when none was registered.
