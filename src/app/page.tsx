import Link from 'next/link';
import CharacterCard from '@/components/CharacterCard';
import { characters } from '@/data/characters';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero section */}
      <section className="py-20 text-center relative">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-burgundy/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <p className="text-gold/80 text-sm uppercase tracking-widest mb-4 font-inter">
            Русская литература XIX века
          </p>
          <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold text-cream mb-6 leading-tight">
            Поговорите с<br />
            <span className="text-gold italic">литературными</span>
            <br />героями
          </h1>
          <p className="text-cream/70 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Онегин, Раскольников, Наташа Ростова и другие персонажи великих романов —
            живые, говорящие, отвечающие на ваши вопросы.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#heroes"
              className="px-8 py-4 bg-gold text-dark-bg font-semibold rounded-full hover:bg-gold/90 transition-all hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5"
            >
              Выбрать героя
            </Link>
            <Link
              href="/recommend"
              className="px-8 py-4 border border-gold/40 text-gold rounded-full hover:bg-gold/10 transition-all"
            >
              Подобрать книгу
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon: '💬',
            title: 'Живой диалог',
            desc: 'Герои отвечают от первого лица, сохраняя характер и речь своей эпохи',
          },
          {
            icon: '📚',
            title: 'Рекомендации',
            desc: 'ИИ подбирает книги по вашим интересам и объясняет, почему они вам подойдут',
          },
          {
            icon: '🏛️',
            title: 'Точность',
            desc: 'Персонажи знают только события своего произведения — без выдумок',
          },
        ].map((f) => (
          <div key={f.title} className="text-center p-6 rounded-lg border border-cream/10 bg-dark-card">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-playfair text-lg text-gold mb-2">{f.title}</h3>
            <p className="text-cream/60 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Heroes grid */}
      <section id="heroes" className="pb-20">
        <div className="text-center mb-10">
          <h2 className="font-playfair text-4xl font-bold text-cream mb-3">
            Выберите <span className="text-gold italic">героя</span>
          </h2>
          <p className="text-cream/50 text-sm">
            {characters.length} персонажей · XIX век · Великие романы
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </section>
    </div>
  );
}
