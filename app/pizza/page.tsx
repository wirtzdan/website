import PizzaPage from "@/components/route-content/pizza-page";
import Layout from "@/layouts/layout";
import { pizzaMetadata } from "@/lib/page-metadata";

export const metadata = pizzaMetadata;

export default function Page() {
  return (
    <Layout>
      <PizzaPage />
    </Layout>
  );
}
