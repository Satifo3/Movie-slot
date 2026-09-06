# MOVIE v6.14.2 — Stable Spin Fix

- v6.14.1 UI/DB/navigation retained
- Replaced heavy per-frame Canvas/SVG reel redraw with CSS translate3d reel strips
- SPIN flow: spin -> left/center/right stop -> guaranteed win line -> WIN -> movie result
- Final symbols remain until next SPIN
- iPhone safety timeout prevents permanent freeze if transitionend is lost
- Errors recover to a valid winning result instead of freezing
