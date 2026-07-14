import { redirect } from "next/navigation";

export default function Home({ params }: { params: { lang: string } }) {
  redirect(`/${params.lang}/dashboard`);
}
