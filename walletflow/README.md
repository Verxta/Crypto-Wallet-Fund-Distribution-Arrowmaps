# WalletFlow

A local blockchain investigation workspace. Your projects live in a SQLite database on this computer, with a React graph interface in the browser. No wallet signing, seed phrase, or hosting account is required.

## Open the app

Open **Start WalletFlow.command** in Finder. It opens [WalletFlow](http://127.0.0.1:4317/) in your browser. Keep the launch window running while you use the collector. Closing the browser does not stop that local process. Closing its window or putting your computer to sleep pauses collection.

From a terminal in this directory, `npm start` starts the app. Node.js 24 or newer is required. Dependencies are installed for this workspace. To rebuild after source edits: `npm run build`.

## Begin an investigation

1. Open the project selector and create a project. The initial Atlas investigation is entirely fictional.
2. For Ethereum normal transactions, add an Etherscan API key in Settings, choose Ethereum mainnet, enter a public address, and run the query. Alternatively, import a normalized event JSON using **Import file**. Download the format example in that dialog.
3. Inspect staged records, select rows, and choose **Add selected to graph →**. The collector and monitor never add evidence automatically.
4. Click a node or transfer to inspect it. Use the Selected Item panel for nicknames and notes. Drag wallets to arrange them. Shift-click nodes and choose Group to create a subsystem; double-click to expand it.
5. Use Trace for forward or earliest-inbound backward paths through accepted evidence. Select an edge and drag its small handle to bend the visual path. Layout changes never alter factual endpoints.
6. Use Export to create a versioned JSON backup. Restore it from the project menu. A restored project is an independent copy.

## Implemented

- Three-panel desktop workspace, draggable dividers, graph maximization, collapsed workbench, and Graph/Data/Notes tabs on compact screens.
- Projects, archive/unarchive, independent forks, view instances, autosaved notes/nicknames/positions, undo/redo, and versioned backup/restore. Optimistic revision checks prevent another window silently overwriting saved work.
- Interactive React Flow graph with pan/zoom, minimap, multiselection, position pins, layered/radial layouts, timeline playback, manual entities/operations, editable hypothetical connections, visual edge bends, nested collapsible groups, and boundary flow summaries.
- Source-event deduplication, conflict retention, provenance enrichment, exact integer-string amounts, separate asset totals, and exclusion of failed/hypothetical transfers from fund-flow totals.
- Etherscan V2 Ethereum mainnet normal-transaction acquisition. Durable SQLite jobs preserve page cursors, raw page responses, explicit scope coverage, partial results, pauses, request budgets, and rate-limit waits. A shared collector sends at most one request every 1.1 seconds.
- Cached time-respecting forward/backward tracing, event-state cycle protection, service stops, maximum depth and event limits, first-funding selection, and incomplete-history notices.
- Optional monitor for eligible Ethereum wallets and the fictional dataset, including hidden/collapsed members. Persistent baselines, chronological event evaluation, reactivation rules, equal-timestamp transaction identities, durable deduplicated in-app alerts, paused restarts, and manual staging of new observations.
- Fictional monitoring simulation: Check now establishes baselines; Simulate reactivation burst adds three synthetic transactions for a testable alert/review workflow.
- Read-only WebMCP investigation summary when supported by the browser.

## Live integration boundaries

**Ethereum:** the adapter requests chain ID 1 through `https://api.etherscan.io/v2/api`, `module=account`, `action=txlist`, ascending order, 100 records per page. It includes normal transactions and their native ETH values. It does not provide internal transfers, ERC-20/NFT movements, complete wallet history, or independently verified evidence. Provider confirmations are shown; monitor eligibility uses 64 confirmations, which is not a proof of finalized-block status. An API key and appropriate provider access are necessary. Live authenticated provider responses have not been exercised in this workspace because no credential was supplied.

**Solana / Robinhood-related networks:** manual import and investigation only. No live endpoint, chain ID, or mainnet/testnet claim is fabricated for the Robinhood-related network.

**Trace:** analysis currently uses accepted records. It does not automatically acquire every missing wallet hop. To expand live evidence, query another wallet, review/import the results, and trace again. History gaps remain explicit.

**Monitor:** native ETH transfers only, no contract/pool polling or external notifications. Initial enrollment processes the full available normal-transaction scope before establishing a baseline. Large scans can remain Catching up until request budgets are extended. A rule change establishes a compatible new baseline. Partial/error responses do not advance processed checkpoints. Previously seen older events are not counted as fresh activity. Full chain reorganization reconciliation, disappeared-transaction detection, provider disagreement adjudication, delayed-indexing analysis, and finalized-block proofs remain future work; this edition is not an authoritative dormancy or finality oracle.

Other later-phase items from the brief include automatic live multi-hop acquisition, sophisticated cycle/relay suggestions, FIFO/proportional attribution, attachment storage, advanced NFT/swap decoding, notification cooldown/digest rules, desktop packaging, and hosted collection. The current edition prioritizes a working local manual investigation and reviewed normal-transaction collection.

## Data and privacy

- `data/walletflow.sqlite` stores projects, recent rollback snapshots, collection jobs/raw responses, monitor baselines, and alert records. SQLite WAL files belong to the running database; use Export for portable backups, or stop the backend before copying the data folder.
- The app binds only to `127.0.0.1`. Cross-origin writes require a local application header and permitted origin. It is not configured for public hosting.
- API credentials are held only in backend memory or supplied through `ETHERSCAN_API_KEY`. They are not written to the project database or export. Re-enter the key after restarting the backend. Do not put credentials into free-text notes.
- Only explicit provider queries transmit wallet addresses to Etherscan. No LLM service is connected. Fonts use Google Fonts if available, with system fallbacks for offline use.
- Background collection requires this computer to be awake, online, and running the local backend. Monitor scheduling starts only through Start; restarts leave it paused while retaining checkpoints.
- The display is capped at 500 nodes; large staging lists load in blocks of 100. Backups support up to 20,000 accepted events and 10,000 wallets in this edition.

## Checks

`npm test` runs deterministic tests for overlapping imports, multi-event transactions, exact large amounts, conflicts, provenance, group boundary totals, failed/hypothesis exclusions, repeated-wallet loop exits, first funding, initial monitor baselines, reactivation bursts, identical timestamps, unknown predecessors, older heads, duplicate alerts, and database reopening. `npm run build` checks the TypeScript interface and produces the local application bundle.

## Primary implementation references

- [Etherscan normal transactions](https://docs.etherscan.io/api-reference/endpoint/txlist)
- [Etherscan rate limits](https://docs.etherscan.io/rate-limits)
- [React Flow subflows](https://reactflow.dev/learn/layouting/sub-flows)

Endpoint documentation checked on September 19, 2026. Plan access and live provider behavior remain dependent on the configured account.
