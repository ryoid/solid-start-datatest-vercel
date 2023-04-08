import { For, Show, Suspense } from 'solid-js';
import { A, createRouteData, RouteDataArgs, useRouteData } from 'solid-start';
import { createServerData$ } from 'solid-start/server';
import { Product } from '~/types';

export function routeData({ params }: RouteDataArgs) {
  const product = createServerData$(
    ([, id]) =>
      fetch(`https://dummyjson.com/products/${id}`).then(
        (r) => r.json() as Promise<Product>
      ),
    { key: () => ['products', params.id] }
  );

  const recommended = createRouteData(
    ([, id]) =>
      fetch(`https://dummyjson.com/products?limit=4&skip=${id}`).then(
        (r) =>
          r.json() as Promise<{
            products: Product[];
          }>
      ),
    { key: () => ['productRecommendations', params.id] }
  );

  return { product, recommended };
}

export default function About() {
  const { product, recommended } = useRouteData<typeof routeData>();

  return (
    <Show when={product()} fallback={<div>Product not found</div>}>
      {(product) => (
        <>
          <div class="flex">
            <div class="sticky left-0 top-0 w-[400px]">
              <div class="relative aspect-square w-full overflow-hidden rounded bg-white/5 opacity-50 delay-75 group-hover:opacity-100">
                <img
                  class="h-full w-full object-cover"
                  src={product().thumbnail}
                  alt={product().title}
                />
              </div>
              <div class="grid grid-cols-2">
                <For each={product().images}>
                  {(image) => (
                    <div class="relative aspect-square w-full overflow-hidden rounded bg-white/5 opacity-50 delay-75 group-hover:opacity-100">
                      <img class="h-full w-full object-cover" src={image} />
                    </div>
                  )}
                </For>
              </div>
            </div>
            <div>
              <h1>{product().title}</h1>
              <div innerHTML={product().description}></div>
            </div>
          </div>
          <div>
            <h2>Recommended</h2>
            <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              <Show
                when={recommended()}
                fallback={<div>Loading recommended...</div>}
              >
                {(recommended) => (
                  <For each={recommended().products}>
                    {(product) => (
                      <A href={`/${product.id}`}>{product.title}</A>
                    )}
                  </For>
                )}
              </Show>
            </div>
          </div>
        </>
      )}
    </Show>
  );
}
