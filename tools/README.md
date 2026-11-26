# Site build helpers

The site is plain static HTML; these scripts only regenerate pages. Nothing runs on deploy.

- `build_pages.py`: writes the top-level pages (index, main-quests, side-quests, writing, cv, contact).
  `python3 tools/build_pages.py .`
- `build_quests.py`: rebuilds `case-studies/*.html` in the current design from the original copy at
  commit `d6b0d61` (needs `pip install beautifulsoup4`). Edit `ADD_AFTER_HEADING` / `TEXT_FIXES` for copy changes.
  `python3 tools/build_quests.py . d6b0d61`

Quest, CV and writing content lives in `js/data.js`, not in these scripts.
