import { For, Show } from 'solid-js';
import { A, useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import ProductCard from "~/components/ProductCard";
import { Product } from "~/types";

export function routeData() {
  return createServerData$(
    async () => {
      const data = await fetch(
        "https://dummyjson.com/products/category/smartphones"
      ).then(
        (r) =>
          r.json() as Promise<{
            products: Product[];
          }>
      );
      return data;
    },
    { key: () => ["homeFeaturedProducts"], deferStream: true }
  );
}

export default function Home() {
  const featured = useRouteData<typeof routeData>();

  return (
    <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      <Show when={featured()} fallback={<div>Loading featured...</div>}>
        {(featured) => (
          <For each={featured().products}>
            {(product) => <ProductCard product={product} />}
          </For>
        )}
      </Show>
    </div>
  );
}
