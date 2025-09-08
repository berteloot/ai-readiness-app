import React from 'react';
import Logo from '@/brand/Logo';
import { PrimaryButton, AccentChip, Card, Header, FeatureGrid } from '@/brand/usage-examples';
import IconChevron from '@/brand/IconChevron';

export default function BrandTestPage() {
  const features = [
    {
      title: 'Brand Colors',
      description: 'Use our carefully crafted color palette for consistent branding.',
      icon: <div className="w-8 h-8 bg-lean-blue rounded"></div>
    },
    {
      title: 'Typography',
      description: 'FormaDJR font with Inter fallback for optimal readability.',
      icon: <div className="w-8 h-8 bg-aqua-breeze rounded"></div>
    },
    {
      title: 'Motion',
      description: 'Subtle animations that enhance user experience.',
      icon: <div className="w-8 h-8 bg-solar-orange rounded"></div>
    }
  ];

  return (
    <div className="min-h-screen bg-paper-offwhite">
      <div className="container mx-auto px-4 py-8">
        <Header
          title="LSG Brand System"
          subtitle="Testing the new brand implementation"
          showLogo={true}
        />
        
        <div className="mt-12 space-y-12">
          {/* Logo Variants */}
          <section className="lsg-reveal">
            <h2 className="text-2xl font-bold text-midnight-core mb-6">Logo Variants</h2>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="text-center">
                <Logo variant="main" size={48} />
                <p className="text-sm text-trust-navy mt-2">Main Logo</p>
              </div>
              <div className="text-center">
                <Logo variant="stacked" size={48} />
                <p className="text-sm text-trust-navy mt-2">Stacked</p>
              </div>
              <div className="text-center">
                <Logo variant="shorthand" size={48} />
                <p className="text-sm text-trust-navy mt-2">Shorthand</p>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="lsg-reveal">
            <h2 className="text-2xl font-bold text-midnight-core mb-6">Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-lean-blue h-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Lean Blue</span>
              </div>
              <div className="bg-momentum-blue h-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Momentum Blue</span>
              </div>
              <div className="bg-trust-navy h-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Trust Navy</span>
              </div>
              <div className="bg-midnight-core h-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Midnight Core</span>
              </div>
              <div className="bg-aqua-breeze h-20 rounded-lg flex items-center justify-center">
                <span className="text-trust-navy font-semibold">Aqua Breeze</span>
              </div>
              <div className="bg-lavender-mist h-20 rounded-lg flex items-center justify-center">
                <span className="text-trust-navy font-semibold">Lavender Mist</span>
              </div>
              <div className="bg-solar-orange h-20 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold">Solar Orange</span>
              </div>
              <div className="bg-sandstone h-20 rounded-lg flex items-center justify-center">
                <span className="text-trust-navy font-semibold">Sandstone</span>
              </div>
            </div>
          </section>

          {/* Buttons */}
          <section className="lsg-reveal">
            <h2 className="text-2xl font-bold text-midnight-core mb-6">Buttons</h2>
            <div className="flex gap-4 flex-wrap">
              <PrimaryButton size="sm">Small Button</PrimaryButton>
              <PrimaryButton size="md">Medium Button</PrimaryButton>
              <PrimaryButton size="lg">Large Button</PrimaryButton>
            </div>
          </section>

          {/* Accent Chips */}
          <section className="lsg-reveal">
            <h2 className="text-2xl font-bold text-midnight-core mb-6">Accent Chips</h2>
            <div className="flex gap-4 flex-wrap">
              <AccentChip variant="aqua">Aqua Breeze</AccentChip>
              <AccentChip variant="lavender">Lavender Mist</AccentChip>
              <AccentChip variant="orange">Solar Orange</AccentChip>
              <AccentChip variant="sandstone">Sandstone</AccentChip>
            </div>
          </section>

          {/* Icons */}
          <section className="lsg-reveal">
            <h2 className="text-2xl font-bold text-midnight-core mb-6">Icons</h2>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <IconChevron direction="up" size={32} color="var(--c-lean-blue)" />
                <p className="text-sm text-trust-navy mt-2">Up</p>
              </div>
              <div className="text-center">
                <IconChevron direction="down" size={32} color="var(--c-lean-blue)" />
                <p className="text-sm text-trust-navy mt-2">Down</p>
              </div>
              <div className="text-center">
                <IconChevron direction="left" size={32} color="var(--c-lean-blue)" />
                <p className="text-sm text-trust-navy mt-2">Left</p>
              </div>
              <div className="text-center">
                <IconChevron direction="right" size={32} color="var(--c-lean-blue)" />
                <p className="text-sm text-trust-navy mt-2">Right</p>
              </div>
            </div>
          </section>

          {/* Motion Examples */}
          <section className="lsg-reveal">
            <h2 className="text-2xl font-bold text-midnight-core mb-6">Motion Examples</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="lsg-emphasize cursor-pointer">
                <h3 className="text-lg font-semibold text-midnight-core mb-2">Emphasize</h3>
                <p className="text-trust-navy">Hover for emphasis animation</p>
              </Card>
              <Card className="lsg-volume cursor-pointer">
                <h3 className="text-lg font-semibold text-midnight-core mb-2">Volume</h3>
                <p className="text-trust-navy">Hover for 3D volume effect</p>
              </Card>
              <Card className="lsg-pulse">
                <h3 className="text-lg font-semibold text-midnight-core mb-2">Pulse</h3>
                <p className="text-trust-navy">Continuous pulse animation</p>
              </Card>
            </div>
          </section>

          {/* Feature Grid */}
          <section className="lsg-reveal">
            <h2 className="text-2xl font-bold text-midnight-core mb-6">Feature Grid</h2>
            <FeatureGrid features={features} />
          </section>
        </div>
      </div>
    </div>
  );
}
