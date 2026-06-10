.PHONY: run treel

# Run the development server locally
run:
	npm run dev

# Apply all pending migrations to the Neon Postgres database
treel:
	tree -a -I "node_modules|.git|.next"