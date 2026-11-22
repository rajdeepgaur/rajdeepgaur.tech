---
order: 3
title: Chart Lookalikes
caseLabel: CASE 03 · DATA / PYTHON
status: LIVE
problem: "Could \"this chart looks like that one\" power a prediction product? I tested that first."
built: "A walk-forward test found no reliable edge, so I built an exploration tool instead: it searches about 500,000 past patterns across 249 NSE stocks in 0.1–2 seconds, with a baseline beside every match."
tags: [Python, pandas, NumPy, Streamlit, pytest, GitHub Actions]
image:
  src: ../../assets/projects/chart-lookalikes-matches.png
  alt: "Chart Lookalikes results: stat cards, a 22-candle pattern against its 30 closest matches, and a histogram of what happened over the next 10 days against the baseline"
  bg: "#0E1117"
  fit: contain
links:
  - { label: Live app, href: "https://chart-lookalikes.streamlit.app/" }
  - { label: GitHub repo, href: "https://github.com/rajdeepgaur/chart-lookalikes" }
page: false
---
