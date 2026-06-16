export default async function ProductsPage() {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/products`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`)
    }

    const data = await res.json()

    return (
      <div>
        <h1>Products</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  } catch (err) {
    console.error("Fetch failed:", err)
    return <div>Failed to load products</div>
  }
}