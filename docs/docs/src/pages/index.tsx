import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

/* ─── Hero ─────────────────────────────────────────────────── */

function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroInner}>
          <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
            {siteConfig.title}
          </Heading>
          <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
            {siteConfig.tagline}
          </p>
          <div className={styles.heroBadges}>
            <img
              src="https://img.shields.io/npm/v/@phucprime/react-native-image-editor.svg?style=flat-square"
              alt="npm version"
            />
            <img
              src="https://img.shields.io/npm/dm/@phucprime/react-native-image-editor.svg?style=flat-square"
              alt="npm downloads"
            />
            <img
              src="https://img.shields.io/badge/React%20Native-New%20Architecture-blue?style=flat-square"
              alt="New Architecture"
            />
            <img
              src="https://img.shields.io/npm/l/@phucprime/react-native-image-editor.svg?style=flat-square"
              alt="license"
            />
          </div>

          <div className={styles.heroButtons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/getting-started"
            >
              Get Started →
            </Link>
            <Link
              className="button button--outline button--lg"
              to="/docs/api/image-editor"
              style={{
                marginLeft: '1rem',
                color: 'white',
                borderColor: 'rgba(255,255,255,0.6)',
              }}
            >
              API Reference
            </Link>
          </div>
          <ScreenshotsSection />
        </div>
      </div>
    </header>
  );
}

/* ─── Feature list ──────────────────────────────────────────── */

type Feature = {
  emoji: string;
  title: string;
  description: ReactNode;
};

const FEATURES: Feature[] = [
  {
    emoji: '✂️',
    title: 'Image Cropping',
    description: (
      <>
        Precision native crop powered by <strong>UCrop</strong> on Android and
        the <strong>iOSPhotoEditor</strong> SDK on iOS. Handles EXIF orientation
        automatically.
      </>
    ),
  },
  {
    emoji: '🎨',
    title: 'Freehand Drawing',
    description: (
      <>
        Brush tool with a fully customisable colour palette. Pass your own hex
        colours or use the built-in 13-colour default palette.
      </>
    ),
  },
  {
    emoji: '✍️',
    title: 'Text Overlays',
    description: (
      <>
        Add, drag, scale, and rotate text layers with per-layer colour control.
        Fully localizable via the <code>languages</code> prop.
      </>
    ),
  },
  {
    emoji: '🎭',
    title: 'Sticker Overlays',
    description: (
      <>
        Drop any PNG sticker from your native resource bundle onto the image.
        Stickers are moveable and scalable.
      </>
    ),
  },
  {
    emoji: '🚀',
    title: 'New Architecture Ready',
    description: (
      <>
        Ships a <strong>TurboModule codegen spec</strong> for zero-overhead
        interop on New Architecture (Fabric + TurboModules) while remaining
        fully compatible with the classic bridge.
      </>
    ),
  },
  {
    emoji: '🔷',
    title: 'TypeScript First',
    description: (
      <>
        Every prop, callback, and constant is strongly typed. Ships CJS, ESM,
        and <code>.d.ts</code> declaration files built by{' '}
        <code>react-native-builder-bob</code>.
      </>
    ),
  },
  {
    emoji: '📐',
    title: 'Promise & Callback APIs',
    description: (
      <>
        Use <code>ImageEditor.edit(path)</code> for async/await flows, or{' '}
        <code>ImageEditor.open(config)</code> for callback-based integration.
        Both share identical options.
      </>
    ),
  },
  {
    emoji: '🌏',
    title: 'Fully Localizable',
    description: (
      <>
        Every UI string in the editor — buttons, dialogs, permissions — is
        overridable at runtime via the <code>languages</code> prop. No native
        rebuild required.
      </>
    ),
  },
  {
    emoji: '🛡️',
    title: 'Apache 2.0 Licensed',
    description: (
      <>
        Permissive open-source license. Free to use in commercial projects
        without attribution in binaries.
      </>
    ),
  },
];

function FeatureCard({ emoji, title, description }: Feature) {
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <div className={clsx('feature-card', styles.featureCard)}>
        <div className={styles.featureEmoji}>{emoji}</div>
        <Heading as="h3" className={styles.featureTitle}>
          {title}
        </Heading>
        <p className={styles.featureDesc}>{description}</p>
      </div>
    </div>
  );
}

/* ─── Screenshots ───────────────────────────────────────────── */

function ScreenshotsSection() {
  return (
    <section className={styles.screenshotsSection}>
      <div className="container">
        <div className={styles.screenshotsRow}>
          <div className={styles.screenshotCard}>
            <div className={styles.screenshotFrame}>
              <img
                src="/react-native-image-editor/img/ios.gif"
                alt="iOS demo — crop, draw, text and stickers on iPhone"
                className={styles.screenshotGif}
                loading="lazy"
              />
            </div>
          </div>
          <div className={styles.screenshotCard}>
            <div className={styles.screenshotFrame}>
              <img
                src="/react-native-image-editor/img/android.gif"
                alt="Android demo — crop, draw, text and stickers on Android"
                className={styles.screenshotGif}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Compatibility table ───────────────────────────────────── */

function CompatibilitySection() {
  return (
    <section className={styles.compatSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          Compatibility
        </Heading>
        <div className="row">
          <div className="col col--8 col--offset-2">
            <table className={styles.compatTable}>
              <thead>
                <tr>
                  <th>Platform / Tool</th>
                  <th>Minimum</th>
                  <th>Tested With</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>React Native</td>
                  <td>
                    <code>≥ 0.73</code>
                  </td>
                  <td>
                    <code>0.78.2</code>
                  </td>
                </tr>
                <tr>
                  <td>React</td>
                  <td>
                    <code>≥ 18.2.0</code>
                  </td>
                  <td>
                    <code>19.0.0</code>
                  </td>
                </tr>
                <tr>
                  <td>iOS</td>
                  <td>
                    <code>13.0</code>
                  </td>
                  <td>
                    <code>18.0</code>
                  </td>
                </tr>
                <tr>
                  <td>Android</td>
                  <td>
                    API <code>24</code>
                  </td>
                  <td>
                    API <code>35</code>
                  </td>
                </tr>
                <tr>
                  <td>Architecture</td>
                  <td>Old Arch ✅</td>
                  <td>New Arch ✅</td>
                </tr>
                <tr>
                  <td>Node.js</td>
                  <td>
                    <code>≥ 16</code>
                  </td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Quick install ─────────────────────────────────────────── */

function QuickInstallSection() {
  return (
    <section className={styles.installSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionHeading}>
          Quick Install
        </Heading>
        <div className="row">
          <div className="col col--6">
            <pre className={styles.installBlock}>
              <code>npm install @phucprime/react-native-image-editor</code>
            </pre>
          </div>
          <div className="col col--6">
            <pre className={styles.installBlock}>
              <code>yarn add @phucprime/react-native-image-editor</code>
            </pre>
          </div>
        </div>
        <div className={styles.installCta}>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started"
          >
            Full Setup Guide →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */

export default function Home(): ReactNode {
  return (
    <Layout
      title="Native Image Editor for React Native"
      description="React Native Image Editor — native crop, draw, text overlays and stickers for iOS and Android. Supports New Architecture (TurboModules)."
    >
      <HomepageHero />

      <main>
        <section className={styles.featuresSection}>
          <div className="container">
            <Heading as="h2" className={styles.sectionHeading}>
              Features
            </Heading>
            <div className="row">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>
        <CompatibilitySection />
        <QuickInstallSection />
      </main>
    </Layout>
  );
}
