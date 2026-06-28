export default function PrivacyPage() {
  return (
    <article className="container-page max-w-4xl py-10 sm:py-16">
      <div className="glass-panel rounded-[24px] p-5 sm:rounded-[30px] sm:p-12">
      <p className="section-label">Legal</p>
      <h1 className="gradient-text mt-2 font-[var(--font-display)] text-3xl font-extrabold sm:text-4xl">Privacy policy</h1>
      <div className="mt-8 space-y-5 leading-8 text-muted-foreground">
        <p>Twibbon Hero processes account information and campaign activity through Supabase. Photos selected in the editor remain in your browser and are not uploaded to our servers.</p>
        <p>Campaign owners upload public frames and banners. Basic usage, download, and share events are recorded to provide aggregate campaign statistics.</p>
        <p>Contact the site administrator to request access, correction, or deletion of personal account data.</p>
      </div>
      </div>
    </article>
  );
}
