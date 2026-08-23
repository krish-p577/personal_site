import React from 'react';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <section className={'py-24'}>
      <div className={'container'}>
        <h1 className="text-3x1 font-bold">Welcome to me #aura</h1>
      </div>
    </section>
  );
}