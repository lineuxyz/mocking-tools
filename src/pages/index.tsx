import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Typed from "typed.js";

export default function Home() {
  const el = useRef<HTMLSpanElement>(null);
  const typed = useRef<Typed | null>(null);

  useEffect(() => {
    const strings = [
      "Mocka suas aplicações",
      "Constrói suas aplicações",
      "Testa suas aplicações",
    ];

    const formattedStrings = strings.map((s) =>
      s.replace(
        /Mocka|Constrói|Testa/g,
        (match) =>
          `<span class="relative whitespace-nowrap text-[#8B63FF]"><span class="relative">${match}</span></span>`
      )
    );

    const options = {
      strings: formattedStrings,
      typeSpeed: 80,
      backSpeed: 40,
      loop: true,
    };

    typed.current = new Typed(el.current, options);

    return () => {
      if (!typed.current) return;

      typed.current.destroy();
    };
  }, []);

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20 background-gradient">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-[#101010] sm:text-7xl">
          Facilitando como você <br />
          <span ref={el}>
            suas aplicações
          </span>
        </h1>
        <h2 className="mx-auto mt-12 text-lg text-[#101010] leading-7">
          Você pode criar mocks para suas aplicações, enquanto aguarda a API de
          verdade ficar pronta.
          <br /> Pode simular os métodos{" "}
          <span className="whitespace-nowrap text-[#8B63FF]">GET</span>,{" "}
          <span className="whitespace-nowrap text-[#8B63FF]">POST</span>,{" "}
          <span className="whitespace-nowrap text-[#8B63FF]">PUT</span>,{" "}
          <span className="whitespace-nowrap text-[#8B63FF]">PATCH</span> e{" "}
          <span className="whitespace-nowrap text-[#8B63FF]">DELETE</span>
        </h2>
        <Link
          className="bg-[#8B63FF] rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-[#6749bf] transition"
          href="/editor"
        >
          + Novo mock
        </Link>

        <section
          id="testimonials"
          aria-label="What our customers are saying"
          className="py-10"
        >
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-[#101010] sm:text-7xl">
            Nossa{" "}
            <span className="relative whitespace-nowrap text-[#8B63FF]">
              <span className="relative">Tecnologia</span>
            </span>
          </h1>
          <h2 className="mx-auto mt-12 text-lg text-[#101010] leading-7">
            Temos um editor de texto, onde você pode criar sua estrutura em{" "}
            <span className="whitespace-nowrap text-[#8B63FF]">JSON</span>, E{" "}
            <br /> criar os seus mocks, é possível editar, visualizar e deletar.
            Tudo de forma simples, intuitiva e{" "}
            <span className="whitespace-nowrap text-[#8B63FF]">Grátis</span>.
          </h2>

          <div className="flex items-center justify-center">
            <Image
              alt="header text"
              src="/editor.png"
              quality={100}
              width={720}
              height={62}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
