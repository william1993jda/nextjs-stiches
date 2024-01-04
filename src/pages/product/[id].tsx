import { ImageContainer, ProductContainer, ProductDetails } from "./product"
import { GetStaticPaths, GetStaticProps } from "next"
import Stripe from 'stripe';
import { stripe } from "../../lib/stripe";
import Image from "next/image";

interface ProductProps {
  product: {
    id: string;
    name: string;
    imageUrl: string;
    price: string;
    description: string;
  }[]
}

export default function Product({ product }: ProductProps) {

  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>
      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>
        <p>{product.description}</p>
        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
  )
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   // Buscar os produtos mais vendidos / mais acessados

//   return {
//     paths: [
//       { params: { id: 'prod_MrOKqBqqYz3p0A' }}// id de um dos produtos cadastrados no stripe
//     ],
//     fallback: true,
//   }
// }


// GetStaticProps<tigaem do retorno, tipagem dos parâmetros recebidos pela rota>
export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {
  const productId = params.id;// parâmetro vindo da rota da página de produto

  // Buscando dados do produto
  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  // Declarando tipagem do price
  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(price.unit_amount / 100),
        description: product.description,
        defaultPriceId: price.id,
      }
    },
    revalidate: 60 * 60 * 1, // 1 hour
  }
}