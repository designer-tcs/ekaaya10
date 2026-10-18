<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Vercel deploys use vercel.json with NITRO_PRESET=vercel; the Lovable build pins its own preset, so both targets work from the same config.
- Store site images as real files in src/assets and import them directly (no .asset.json CDN pointers) — the CDN path only resolves on Lovable hosting, not Vercel.
