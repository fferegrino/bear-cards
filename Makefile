.PHONY: run

run:
	uv run python src/sort_packs.py
	uv run python src/generate_plots.py
