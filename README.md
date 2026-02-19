## 🔄 Complete Data Flow Diagram
```
USER                    FRONTEND                 BACKEND
 │                          │                       │
 │── uploads CSV ──────────>│                       │
 │                          │── validate locally ──>│
 │                          │                       │
 │                          │── POST /analyze ──────>│
 │                          │   (multipart/form)    │
 │                          │                       │── parse CSV
 │                          │                       │── build graph
 │<── loading progress ─────│<── SSE stream ────────│── detect cycles
 │                          │                       │── detect smurfing
 │                          │                       │── detect shells
 │                          │                       │── filter FP
 │                          │                       │── score accounts
 │                          │                       │── assign ring IDs
 │                          │                       │── build JSON
 │                          │                       │
 │                          │<── JSON response ─────│
 │                          │                       │
 │                          │── render graph ───────│
 │                          │── render table        │
 │                          │── render cards        │
 │<── results dashboard ────│                       │
 │                          │                       │
 │── hover node ───────────>│                       │
 │<── account tooltip ──────│                       │
 │                          │                       │
 │── click download ───────>│                       │
 │<── JSON file download ───│                       │

