# IndiaEV — Claude Code Guidelines

## Git Workflow

All development work must follow this flow:

1. **Create a feature branch** from `main` before starting any implementation
2. **Implement on the branch** — never commit feature work directly to `main`
3. **Open a PR** for review — do not merge locally; always use `gh pr create`
4. **User reviews and merges** the PR

Branch naming: `feat/<topic>`, `fix/<topic>`, `chore/<topic>`

This applies to all tasks regardless of size.
