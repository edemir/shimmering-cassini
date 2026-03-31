# 📦 09 - MCP Server Source v2 (server.py)

This is an alternative version of the MCP server with a richer product dataset and an additional `get_product_inventory` tool.

Copy this into `~/mcp-on-cloudrun/server.py` if you want to use the expanded dataset.

```python {codejar}
import asyncio
import logging
import os
from typing import List, Dict, Any
from fastmcp import FastMCP

logger = logging.getLogger(__name__)
logging.basicConfig(format="[%(levelname)s]: %(message)s", level=logging.INFO)

mcp = FastMCP("Product Inventory MCP Server 📦🏷️📊")

# Mock transactional product datastore
PRODUCTS = [
    {"category": "electronics", "product_id": "ELEC-1001", "name": "Wireless Bluetooth Headphones", "price": 79.99, "warehouse": "West Coast Fulfillment Center", "quantity_on_hand": 342, "reorder_point": 50, "supplier": "AudioTech Inc."},
    {"category": "electronics", "product_id": "ELEC-1002", "name": "USB-C Fast Charger", "price": 24.99, "warehouse": "West Coast Fulfillment Center", "quantity_on_hand": 1200, "reorder_point": 200, "supplier": "PowerUp Supply Co."},
    {"category": "electronics", "product_id": "ELEC-1003", "name": "4K Webcam", "price": 129.99, "warehouse": "East Coast Distribution Hub", "quantity_on_hand": 87, "reorder_point": 30, "supplier": "VisionClear Technologies"},
    {"category": "electronics", "product_id": "ELEC-1004", "name": "Portable SSD 1TB", "price": 89.99, "warehouse": "East Coast Distribution Hub", "quantity_on_hand": 455, "reorder_point": 100, "supplier": "DataVault Storage"},
    {"category": "clothing", "product_id": "CLTH-2001", "name": "Classic Fit Cotton T-Shirt", "price": 19.99, "warehouse": "Central Warehouse", "quantity_on_hand": 2500, "reorder_point": 500, "supplier": "ThreadWorks Apparel"},
    {"category": "clothing", "product_id": "CLTH-2002", "name": "Slim Fit Denim Jeans", "price": 49.99, "warehouse": "Central Warehouse", "quantity_on_hand": 780, "reorder_point": 150, "supplier": "ThreadWorks Apparel"},
    {"category": "clothing", "product_id": "CLTH-2003", "name": "Waterproof Hiking Jacket", "price": 134.99, "warehouse": "West Coast Fulfillment Center", "quantity_on_hand": 210, "reorder_point": 40, "supplier": "Summit Gear Co."},
    {"category": "clothing", "product_id": "CLTH-2004", "name": "Merino Wool Sweater", "price": 69.99, "warehouse": "East Coast Distribution Hub", "quantity_on_hand": 390, "reorder_point": 75, "supplier": "Alpine Textiles"},
    {"category": "home_goods", "product_id": "HOME-3001", "name": "Stainless Steel Water Bottle", "price": 29.99, "warehouse": "Central Warehouse", "quantity_on_hand": 1800, "reorder_point": 300, "supplier": "EcoLiving Supplies"},
    {"category": "home_goods", "product_id": "HOME-3002", "name": "Ceramic Coffee Mug Set", "price": 34.99, "warehouse": "Central Warehouse", "quantity_on_hand": 650, "reorder_point": 100, "supplier": "Artisan Home Co."},
    {"category": "home_goods", "product_id": "HOME-3003", "name": "Bamboo Cutting Board", "price": 22.99, "warehouse": "West Coast Fulfillment Center", "quantity_on_hand": 920, "reorder_point": 150, "supplier": "EcoLiving Supplies"},
    {"category": "home_goods", "product_id": "HOME-3004", "name": "LED Desk Lamp", "price": 44.99, "warehouse": "East Coast Distribution Hub", "quantity_on_hand": 315, "reorder_point": 60, "supplier": "BrightSpace Lighting"},
    {"category": "home_goods", "product_id": "HOME-3005", "name": "Non-Stick Cookware Set", "price": 149.99, "warehouse": "Central Warehouse", "quantity_on_hand": 125, "reorder_point": 25, "supplier": "ChefPro Kitchenware"},
    {"category": "sporting_goods", "product_id": "SPRT-4001", "name": "Yoga Mat Premium", "price": 39.99, "warehouse": "West Coast Fulfillment Center", "quantity_on_hand": 560, "reorder_point": 100, "supplier": "FlexFit Athletics"},
    {"category": "sporting_goods", "product_id": "SPRT-4002", "name": "Adjustable Dumbbell Set", "price": 199.99, "warehouse": "Central Warehouse", "quantity_on_hand": 74, "reorder_point": 15, "supplier": "IronCore Fitness"},
    {"category": "sporting_goods", "product_id": "SPRT-4003", "name": "Running Shoes - Trail Edition", "price": 119.99, "warehouse": "East Coast Distribution Hub", "quantity_on_hand": 430, "reorder_point": 80, "supplier": "Summit Gear Co."},
    {"category": "sporting_goods", "product_id": "SPRT-4004", "name": "Insulated Sports Water Bottle", "price": 27.99, "warehouse": "West Coast Fulfillment Center", "quantity_on_hand": 1100, "reorder_point": 200, "supplier": "FlexFit Athletics"},
    {"category": "books", "product_id": "BOOK-5001", "name": "Python Programming Masterclass", "price": 44.99, "warehouse": "Central Warehouse", "quantity_on_hand": 290, "reorder_point": 50, "supplier": "PageTurner Publishing"},
    {"category": "books", "product_id": "BOOK-5002", "name": "Cloud Architecture Patterns", "price": 54.99, "warehouse": "Central Warehouse", "quantity_on_hand": 185, "reorder_point": 30, "supplier": "PageTurner Publishing"},
    {"category": "books", "product_id": "BOOK-5003", "name": "Data Engineering Fundamentals", "price": 49.99, "warehouse": "East Coast Distribution Hub", "quantity_on_hand": 220, "reorder_point": 40, "supplier": "TechPress Media"},
    {"category": "books", "product_id": "BOOK-5004", "name": "Machine Learning in Practice", "price": 59.99, "warehouse": "West Coast Fulfillment Center", "quantity_on_hand": 160, "reorder_point": 25, "supplier": "TechPress Media"},
]

@mcp.tool()
def get_product_details(product_ids: List[str]) -> List[Dict[str, Any]]:
    """
    Retrieves the full details for a list of products by their product IDs.

    Args:
        product_ids: A list of unique product identifiers
                     (e.g., ['ELEC-1001', 'CLTH-2002']).

    Returns:
        A list of dictionaries, where each dictionary contains a product's
        details (category, product_id, name, price, warehouse,
        quantity_on_hand, reorder_point, supplier). Products not found
        are omitted from the results.
    """
    logger.info(f">>> 🛠️ Tool: 'get_product_details' called for '{product_ids}'")
    ids_upper = {pid.upper() for pid in product_ids}
    return [product for product in PRODUCTS if product["product_id"].upper() in ids_upper]

@mcp.tool()
def get_product_inventory(categories: List[str]) -> List[Dict[str, Any]]:
    """
    Retrieves inventory information for all products in the given categories.

    Can also be used to collect the base data for aggregate queries
    across product categories — like counting total items in stock,
    finding the most expensive product, or identifying items below
    their reorder point.

    Args:
        categories: A list of product categories (e.g., ['electronics',
                    'clothing', 'home_goods', 'sporting_goods', 'books']).

    Returns:
        A list of dictionaries, where each dictionary represents a product
        and contains details like name, price, quantity_on_hand, and warehouse.
    """
    logger.info(f">>> 🛠️ Tool: 'get_product_inventory' called for '{categories}'")
    cats_lower = {cat.lower() for cat in categories}
    return [product for product in PRODUCTS if product["category"].lower() in cats_lower]

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    logger.info(f"🚀 MCP server started on port {port}")
    asyncio.run(
        mcp.run_async(
            transport="http",
            host="0.0.0.0",
            port=port,
        )
    )
```

---

**Back to:** [09 - Create MCP Server](agent-lab/09-create-an-mcp-server.md)
