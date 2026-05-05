"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FadeInImage } from '@/components/ui/FadeInImage';
import { useStoryImages } from '@/lib/useStoryImages';

const STORY_FALLBACK_IMAGE = '/trees.jpg';
const STORY_ROTATE_INTERVAL_MS = 5000;

const GENESIS_PARAGRAPHS: string[] = [
  'In India, the “Vaidya” community were known for being practitioners of medicine.',
  'My family that belonged to this community boasted of some well-known doctors and healers.',
  'Dr. Subol Majumdar, my mother’s uncle, was one such individual. He was a well-known Ayurvedic doctor of his generation and some of my cherished childhood memories revolved around watching him dole out potent medicines to the long line of patients waiting to be cured. His knowledge of herbs, roots and seeds was infinite.',
  'Even my mother, grandmother and great grandmother were women of profound wisdom. They would mix and measure various ingredients, sourced from the kitchen larder, and create miracles that would cure all our illnesses.',
  'Unknown to me my initiation in sustained wellness began with them.',
  'Growing up in a family that was a treasure trove of home remedies for almost all maladies triggered a deep desire in me to preserve and nurture this special skill for the benefit of others.',
  'When I got married, I carried with me this deep interest in home remedies to my new home captured within the yellowed pages of an old notebook.',
  'Little nuggets of knowledge like massaging asafoetida (a culinary ingredient also known as Hing) mixed in water around the belly button of infants to help relieve constipation worked like magic.',
  'We call these ‘totkas’ in Bengali, my native language.',
  'But to me, every totka was also a tradition. A practice that was honed into me from my early childhood.',
  'In 2020, I was down with Covid.',
  'Desolate, depressed and demotivated, I began to search for a purpose to live.',
  'It was then that the memory of the old notebook appeared in the recesses of my mind.',
  'I began to see the path ahead of me.',
  'I realised I wanted to revive the dying tradition of practicing totkas to ensure wellness for all.',
  'That would be my DhruboTara, the guiding light to carry forward my legacy of good health.',
  'My natural interest in herbs further boosted my passion and led me to read up a lot on their benefits and advantages.',
  'In October 2024, out of sheer personal interest and inclination I began to prepare mixtures made from simple and easily available ingredients and share them with all my friends and relatives.',
  'Soon I began to receive positive feedback from my known circles.',
  'My totkas are able to cure symptomatically as well as ensure that a regular use helps you remain happy and healthy.',
  'It delivers good health as well as ensures continued wellness.',
  'All my ingredients are the ones that are readily available in the kitchen and hence consumed on a regular basis.',
  'If you are allergic to any particular ingredient, I can also suggest a totka without that. However, you must note that the effect might be slightly delayed in that case.',
  'Nevertheless, as the saying goes “Better late than never”.',
  'Hence, it is always better to have some respite, even though delayed, rather than suffer endlessly.',
  'My totkas are not the result of professional expertise but purely a labour of love.',
  'They are not mere mixtures but memories that help me carry forward my legacy of wellness.',
  'An inheritance that I am proud to share with the world.',
];

const journeySteps = [
  {
    id: "01",
    title: "The Genesis",
    subtitle: "The initiation into wellness",
    content: [
      "In India, the \"Vaidya\" community were known for being practitioners of medicine. My family, which belonged to this community boasted of some well-known doctors and healers.",
      "Dr. Subol Majumdar, my mother's uncle, was one such individual. He was a well-known Ayurvedic doctor of his generation and some of my cherished childhood memories revolved around watching him dole out potent medicines to the long line of patients waiting to be cured. His knowledge of herbs, roots and seeds was infinite.",
      "Even my mother, grandmother and great grandmother were women of profound wisdom. They would mix and measure various ingredients, sourced from the kitchen larder, and create miracles that would cure all our illnesses.",
      "Unknown to me, my initiation in sustained wellness began with them.",
      "Growing up in a family that was a treasure trove of home remedies for almost all maladies triggered a deep desire in me to preserve and nurture this special skill for the benefit of others.",
      "When I got married, I carried with me this deep interest in home remedies to my new home captured within the yellowed pages of an old notebook.",
      "Little nuggets of knowledge like massaging asafoetida (a culinary ingredient also known as Hing) mixed in water around the belly button of infants to help relieve constipation worked like magic.",
      "We call these 'totkas' in Bengali, my native language. But to me, every totka was also a tradition. A practice that was honed into me from my early childhood."
    ]
  },
  {
    id: "02",
    title: "The Rediscovery",
    content: [
      "During the pandemic in 2020, when I was recovering from COVID, I began to search for a purpose to live.",
      "It was then that the memory of the old notebook appeared in the recesses of my mind.",
      "I began to see the path ahead of me.",
      "I realised I wanted to revive the dying tradition of practicing totkas to ensure wellness for all.",
      "That would be my DhruboTara, the guiding light to carry forward my legacy of good health."
    ]
  },
  {
    id: "03",
    title: "Sharing Wellness",
    content: [
      "My natural interest in herbs boosted my passion and led me to read up a lot on their benefits and advantages.",
      "In October 2024, driven by a personal passion, I began to prepare mixtures made from simple and easily available ingredients and share them with all my friends and relatives.",
      "Soon I began to receive positive feedback from my known circles.",
      "Thus, Dhrubotara was born not as a business endeavour but as a living legacy of natural care.",
      "My Bengali home remedies or totkas ensure that a regular use helps you remain happy and healthy. It delivers good health as well as ensures continued wellness.",
      "All my ingredients are the ones that are readily available in the kitchen and hence consumed on a regular basis.",
      "If you are allergic to any particular ingredient, I can also suggest a totka without that. However, you must note that the effect might be slightly delayed in that case.",
      "My totkas are not the result of professional expertise but purely a labour of love.",
      "They are not mere mixtures but memories that help me carry forward my legacy of wellness.",
      "An inheritance that I am proud to share with the world."
    ]
  }
];

export default function StoryPage() {
  const { images: storyImages } = useStoryImages();
  const heroImages = storyImages.length > 0
    ? storyImages.map((entry) => ({ key: entry.id, src: entry.image }))
    : [{ key: 'fallback', src: STORY_FALLBACK_IMAGE }];

  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = heroImages.length > 0 ? activeIndex % heroImages.length : 0;
  const activeHero = heroImages[safeIndex];

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, STORY_ROTATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [heroImages.length]);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-white overflow-hidden border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-stone-200 overflow-hidden rounded-sm shadow-xl relative">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={activeHero.key}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                  >
                    <FadeInImage
                      src={activeHero.src}
                      alt="Our Story"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {heroImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  {heroImages.map((img, idx) => (
                    <button
                      key={img.key}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Show story image ${idx + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === safeIndex
                          ? 'w-6 bg-emerald-700'
                          : 'w-2 bg-stone-400/60 hover:bg-stone-500'
                      }`}
                    />
                  ))}
                </div>
              )}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-50 -z-10 rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl text-emerald-950 mb-3">
                Our Story
              </h1>
              <p className="font-serif italic text-emerald-900 text-xl md:text-2xl mb-8">
                The Dhrubotara Genesis
              </p>
              <div className="space-y-5 text-stone-600 font-sans text-base md:text-lg leading-relaxed">
                {GENESIS_PARAGRAPHS.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="py-20 md:py-32 bg-[#FDFBF7] relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="font-serif text-emerald-900/40 italic text-xl">Our Journey</span>
            <h2 className="font-serif text-4xl md:text-5xl text-emerald-950 mt-2">The Legacy of Healing</h2>
          </motion.div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-emerald-900/20 -translate-x-1/2" />

            <div className="space-y-16 md:space-y-24">
              {journeySteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex flex-col md:flex-row gap-8 items-start ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-emerald-900 border-4 border-[#FDFBF7] -translate-x-1/2 mt-6 z-10" />

                  {/* Content */}
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-12 pt-2">
                    <div className="bg-white p-8 rounded-sm shadow-sm border border-emerald-900/5 relative group hover:shadow-md transition-shadow duration-300">
                      <span className="absolute -top-6 right-8 text-6xl font-serif text-emerald-900/5 group-hover:text-emerald-900/10 transition-colors duration-300">
                        {step.id}
                      </span>
                      <h3 className="font-serif text-2xl text-emerald-900 mb-2 relative z-10">
                        {step.title}
                      </h3>
                      {step.subtitle && (
                        <p className="text-emerald-700/60 font-sans text-sm mb-4 relative z-10 italic">
                          {step.subtitle}
                        </p>
                      )}
                      <div className="space-y-4 text-stone-600 font-sans leading-relaxed relative z-10">
                        {step.content.map((paragraph, i) => (
                          <p key={i} dangerouslySetInnerHTML={{ 
                            __html: paragraph.replace('DhruboTara', '<span class="font-medium text-emerald-800">DhruboTara</span>')
                              .replace('Dhrubotara', '<span class="font-medium text-emerald-800">Dhrubotara</span>')
                              .replace('totkas', '<span class="italic">totkas</span>')
                              .replace('totka', '<span class="italic">totka</span>')
                          }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Empty space for the other side */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 md:py-32 bg-emerald-950 text-stone-100 relative overflow-hidden">
        {/* Texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
        
        {/* Decorative gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-800/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="font-serif text-4xl md:text-6xl mb-6 text-white tracking-tight">
              The Dhrubotara Community
            </h2>
            <div className="w-24 h-px bg-emerald-500/50 mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Sabars Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-emerald-900/40 p-8 md:p-12 rounded-sm border border-emerald-800/30 backdrop-blur-sm hover:bg-emerald-900/60 transition-colors duration-500"
            >
              <h3 className="font-serif text-2xl md:text-3xl mb-6 text-emerald-200">
                The Sabars of Sundarban
              </h3>
              <div className="space-y-4 font-sans text-lg text-emerald-100/90 leading-relaxed">
                <p>
                  The Sabars of Sundarban are an indigenous tribal community. Known for their deep connection with the forest and its resources, they thrive primarily by practicing skills that are daring and dangerous.
                </p>
                <p>
                  For generations, they have earned their livelihood with unmatched courage and resilience.
                </p>
                <p>
                  At Dhrubotara, we value this commendable effort and have committed ourselves to transforming this strength into stability.
                </p>
                <p>
                  As an expression of our appreciation, we have made them part of our family providing them with a secure and assured marketplace for their wares.
                </p>
                <p>
                  They are rigorously trained in hygiene practices to ensure our products are suitable for both domestic and international use.
                </p>
                <p>
                  We oversee the packaging of every product with love and care to ensure that the richness of nature remains real from the forest to your home.
                </p>
              </div>
            </motion.div>

            {/* Collective Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-emerald-900/40 p-8 md:p-12 rounded-sm border border-emerald-800/30 backdrop-blur-sm hover:bg-emerald-900/60 transition-colors duration-500"
            >
              <h3 className="font-serif text-2xl md:text-3xl mb-6 text-emerald-200">
                A Collective of Care
              </h3>
              <div className="space-y-4 font-sans text-lg text-emerald-100/90 leading-relaxed">
                <p>
                  Alongside the Sabars, we have also included, underprivileged women from Midnapore, Birbhum, Hooghly, North 24 Parganas and several other districts of West Bengal, within our fold.
                </p>
                <p>
                  Through these carefully curated associations we have built a collective of craft, courage and care.
                </p>
                <p>
                  We pledge to make Dhrubotara a beacon of progress for these communities.
                </p>
                <div className="pt-6 mt-6 border-t border-emerald-800/30">
                  <p className="font-serif italic text-xl text-white">
                    &ldquo;Together, we shine the light on our promise to bring a heritage of health and happiness to all.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
