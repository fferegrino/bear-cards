from __future__ import annotations

from bear_cards.config import PlotConfig
from bear_cards.data import load_cards, load_packs
from bear_cards.plotting import save_fig, setup_matplotlib
from bear_cards.rarity import assign_rarity_tiers

from bear_cards.plots.batch_consistency import plot_batch_consistency
from bear_cards.plots.calendar_heatmap import plot_calendar_heatmap
from bear_cards.plots.distribution_heatmap import plot_card_distribution_heatmap
from bear_cards.plots.duplicate_tracker import plot_duplicate_tracker
from bear_cards.plots.network_graph import plot_flavour_card_network
from bear_cards.plots.production_line_patterns import plot_time_of_production_patterns
from bear_cards.plots.production_timeline import plot_production_timeline_vs_discovery
from bear_cards.plots.rarity_curve import plot_rarity_curve


def main() -> None:
    cfg = PlotConfig()
    setup_matplotlib(cfg)

    packs = load_packs(cfg)
    _cards = load_cards(cfg)  # reserved for later label-enrichment

    packs = assign_rarity_tiers(packs, cfg)

    figs = [
        ("01_production_timeline_vs_discovery.png", plot_production_timeline_vs_discovery(packs, cfg)),
        ("02_card_distribution_heatmap.png", plot_card_distribution_heatmap(packs, cfg)),
        ("03_rarity_curve.png", plot_rarity_curve(packs, cfg)),
        ("04_batch_consistency.png", plot_batch_consistency(packs, cfg)),
        ("05_flavour_card_network.png", plot_flavour_card_network(packs, cfg)),
        ("06_duplicate_tracker.png", plot_duplicate_tracker(packs, cfg)),
        ("07_time_of_production_patterns.png", plot_time_of_production_patterns(packs, cfg)),
        ("08_calendar_heatmap.png", plot_calendar_heatmap(packs, cfg)),
    ]

    for filename, fig in figs:
        out = save_fig(cfg, fig, filename)
        print(out)


if __name__ == "__main__":
    main()

