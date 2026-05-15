# Agent Guidelines

## Temporary Files

Never write to `/tmp` directory. Always use `.temp/` directory in the project root for temporary files.

```bash
# Create temp directory if needed
mkdir -p .temp

# Write temporary files here
echo "data" > .temp/output.txt
```

## Running Tests

Use `yarn vitest` to run tests. Do not use `npx`.

```bash
# Run all tests
yarn vitest run

# Run a specific test file
yarn vitest run path/to/test.tsx
```

## Running TSC

Always run `yarn tsc` when done with a feature to check for type errors.

## Running Lint

Always run `yarn lint` when done with a feature to check for linting errors.
