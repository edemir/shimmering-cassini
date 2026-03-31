# 📦 09 - MCP Server Source (server.py)

This is the source code for your MCP server. Copy this into `~/mcp-on-cloudrun/server.py`.

```python {codejar}
# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "fastmcp",
# ]
# ///

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
    {"sku": "D0761D981BCE5C8706808BB62E20F3B9", "name": "Woolrich Men's Quehanna Cardigan Sweater", "price": 219.0, "category": "Sweaters", "brand": "Woolrich", "department": "Men", "quantity_on_hand": 14, "reorder_point": 5},
    {"sku": "8B48E30332FC417534491CE3FDA913B9", "name": "Columbia Men's Fast Trek Fleece Vest", "price": 43.19, "category": "Outerwear & Coats", "brand": "Columbia", "department": "Men", "quantity_on_hand": 27, "reorder_point": 10},
    {"sku": "0AA2946C67F639237F396261B8A894AB", "name": "Carhartt Mens Work Wear Cushioned Crew Sock", "price": 16.0, "category": "Socks", "brand": "Carhartt", "department": "Men", "quantity_on_hand": 3, "reorder_point": 12},
    {"sku": "F27A4F23A9840CBEE6CCAA3194E86EA0", "name": "Carhartt Men's Big-Tall Tradesman Long Sleeve Shirt", "price": 56.78, "category": "Tops & Tees", "brand": "Carhartt", "department": "Men", "quantity_on_hand": 22, "reorder_point": 8},
    {"sku": "E242FD43536246C7D2D58EC0590C912E", "name": "True Religion Men's Ricky Titan Straight Jeans-Rough River", "price": 184.49, "category": "Jeans", "brand": "True Religion", "department": "Men", "quantity_on_hand": 7, "reorder_point": 3},
    {"sku": "1C95EE9C76A4FB9258CB07573752BEF7", "name": "Lrg Split Tek Zip Up Hoodie", "price": 69.0, "category": "Fashion Hoodies & Sweatshirts", "brand": "LRG", "department": "Men", "quantity_on_hand": 19, "reorder_point": 6},
    {"sku": "99897197639505C33A5007BC38D456C3", "name": "Columbia Sportswear Men's Perfect Cast Polo Shirt", "price": 41.80, "category": "Active", "brand": "Columbia", "department": "Men", "quantity_on_hand": 0, "reorder_point": 15},
    {"sku": "E7CD22624D2439F832CBD30D91600DA6", "name": "Paul Fredrick Wool / Cashmere Flannel Flat Front Pant", "price": 109.50, "category": "Pants", "brand": "Paul Fredrick", "department": "Men", "quantity_on_hand": 11, "reorder_point": 4},
    {"sku": "3B95A878E7E99D5933F0ABD36CA835FA", "name": "RIGGS WORKWEAR by Wrangler Men's Short Sleeve Henley", "price": 27.25, "category": "Tops & Tees", "brand": "Wrangler", "department": "Men", "quantity_on_hand": 29, "reorder_point": 10},
    {"sku": "B2CEA2CE8A7B8EE1AD5A97F9170CF234", "name": "Fruit Of The Loom Men's 4 Pack Boxer Briefs", "price": 33.0, "category": "Underwear", "brand": "Fruit of the Loom", "department": "Men", "quantity_on_hand": 16, "reorder_point": 7},
    {"sku": "93F19DBC4426F203A274642A804F36E8", "name": "Diesel Men's Michael Tee", "price": 39.0, "category": "Underwear", "brand": "Diesel", "department": "Men", "quantity_on_hand": 2, "reorder_point": 9},
    {"sku": "9EF7F0360A59458D3FC8146AC7DF4C71", "name": "American Apparel Poly-Cotton Short Sleeve Crew Neck", "price": 20.0, "category": "Tops & Tees", "brand": "American Apparel", "department": "Men", "quantity_on_hand": 25, "reorder_point": 11},
    {"sku": "87EFE7B5FA21D969F4CA491ED04B0149", "name": "Classics Womens Stretch Sport Bikini Assorted", "price": 10.53, "category": "Intimates", "brand": "Hanes", "department": "Women", "quantity_on_hand": 8, "reorder_point": 20},
    {"sku": "2A822AFD087F6001D3A645686FF08389", "name": "Ed Hardy Men's Premium Love Kills Slowly Trunk", "price": 14.99, "category": "Underwear", "brand": "Ed Hardy", "department": "Men", "quantity_on_hand": 30, "reorder_point": 13},
    {"sku": "9EBD41E6CBC1E14780805F6FC0D65867", "name": "ExOfficio Men's Give-N-Go Sport Brief", "price": 20.0, "category": "Active", "brand": "ExOfficio", "department": "Men", "quantity_on_hand": 5, "reorder_point": 18},
    {"sku": "E9CB54CBC877FE2CF2BC1293D2EC1254", "name": "Allegra K Mens Zipper Closure Dinosaur Designed Hoody Coat Light Gray S", "price": 20.37, "category": "Fashion Hoodies & Sweatshirts", "brand": "Allegra K", "department": "Men", "quantity_on_hand": 21, "reorder_point": 7},
    {"sku": "C77409B2F7DABC444A533B98D9381690", "name": "Barely There Women's Customflex Fit Lighly Lined Wirefree", "price": 29.0, "category": "Intimates", "brand": "Barely There", "department": "Women", "quantity_on_hand": 13, "reorder_point": 4},
    {"sku": "A3B2E0D095B2D7155D1B7739488F9FF1", "name": "Aeropostale Mens Crewneck Sweater - Style 2128", "price": 29.99, "category": "Sweaters", "brand": "Aeropostale", "department": "Men", "quantity_on_hand": 1, "reorder_point": 15},
    {"sku": "CE81F8E75A87B17708D10A0684FBE1EC", "name": "Roxy Women's Sun Blossom Smocked Boy Brief", "price": 41.04, "category": "Swim", "brand": "Roxy", "department": "Women", "quantity_on_hand": 17, "reorder_point": 6},
    {"sku": "1138D90EF0A0848A542E57D1595F58EA", "name": "Woman Within Plus Size Jean relaxed fit with 5-pocket styling", "price": 24.99, "category": "Jeans", "brand": "Woman Within", "department": "Women", "quantity_on_hand": 9, "reorder_point": 22},
]

@mcp.tool()
def get_product_details(skus: List[str]) -> List[Dict[str, Any]]:
    """
    Retrieves the full details for a list of products by their SKUs.

    Args:
        skus: A list of unique SKU identifiers
              (e.g., ['D0761D981BCE5C8706808BB62E20F3B9',
                      '0AA2946C67F639237F396261B8A894AB']).

    Returns:
        A list of dictionaries, where each dictionary contains a product's
        details (product_id, sku, name, price, category, brand, department,
        quantity_on_hand, reorder_point).
        Products not found are omitted from the results.
    """
    logger.info(f">>> 🛠️ Tool: 'get_product_details' called for '{skus}'")
    sku_set = set(skus)
    return [product for product in PRODUCTS if product["sku"] in sku_set]

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

**Next:** [09 - Dockerfile →](agent-lab/09-dockerfile.md)
