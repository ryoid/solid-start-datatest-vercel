import type { Component } from "solid-js";
import { A } from "solid-start";
import { Product } from "~/types";

type ProductCardProps = {
  product: Product;
};

const ProductCard: Component<ProductCardProps> = (props) => {
  return (
    <A href={`/products/${props.product.id}`}>
      <div class="relative aspect-square w-full overflow-hidden rounded bg-white/5 opacity-50 delay-75 group-hover:opacity-100">
        <img
          class="h-full w-full object-cover"
          src={props.product.thumbnail}
          alt={props.product.title}
        />
      </div>
      <span>{props.product.title}</span>
    </A>
  );
};

export default ProductCard;
