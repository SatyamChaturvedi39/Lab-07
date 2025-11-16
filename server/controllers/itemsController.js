import items from "../data/items.js";

export function getRoot(req, res) {
  res.json({
    service: "Digvijay Express API",
    endpoints: ["/api/items", "/api/items/:id", "/api/items?mode=air&maxPrice=500"]
  });
}

export function getItems(req, res) {
  const { mode, maxPrice, minPrice, search } = req.query;
  let result = items.slice();
  if (mode) result = result.filter(i => i.mode.toLowerCase() === mode.toLowerCase());
  if (maxPrice !== undefined) {
    const mp = Number(maxPrice);
    if (!Number.isNaN(mp)) result = result.filter(i => i.price <= mp);
  }
  if (minPrice !== undefined) {
    const mn = Number(minPrice);
    if (!Number.isNaN(mn)) result = result.filter(i => i.price >= mn);
  }
  if (search) {
    const s = String(search).toLowerCase();
    result = result.filter(i => i.name.toLowerCase().includes(s) || i.origin.toLowerCase().includes(s) || i.destination.toLowerCase().includes(s));
  }
  res.json({ count: result.length, items: result });
}

export function getItemById(req, res) {
  const id = Number(req.params.id);
  const found = items.find(i => i.id === id);
  if (!found) return res.status(404).json({ error: "Item not found" });
  res.json(found);
}